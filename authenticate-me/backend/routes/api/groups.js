const express = require('express')

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Membership, Venue, Event, EventImage, Attendance } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

const validateGroup = [
  check('name')
    .isLength({ min: 1, max: 60 })
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({ checkFalsy: true })
    .withMessage('Type must be "Online" or "In person"'),
  check('private')
    .exists()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  handleValidationErrors
];

const validateVenue = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('lat')
    .exists()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is not valid'),
  handleValidationErrors
]

const validateEvent = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .exists({ checkFalsy: true })
    .withMessage('Type must be Online or In person'),
  check('capacity')
    .exists({ checkFalsy: true })
    .withMessage('Capacity must be an integer'),
  check('price')
    .exists()
    .withMessage('Price is invalid'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date must be in the future'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is less than start date'),
  handleValidationErrors
]

router.get('/', async (req, res) => {
  const groups = await Group.findAll({
    include: {
      model: GroupImage
    },
  })
  const groupList = []
    groups.forEach(group => {
      groupList.push(group.toJSON())
    })
    const numMembers = async () => {
      for (let group of groupList) {
        const members = await Membership.count({
          where: {groupId: group.id}
        })
        group.numMembers = members;
      }
    }
    await numMembers()
    groupList.forEach(group => {
      group.GroupImages.forEach(image => {
        if (image.preview === true) {
          group.previewImage = image.url
        }
      })
      if(!group.previewImage) {
        group.previewImage = 'no preview image'
      }
      delete group.GroupImages
    })

  res.json({Groups: groupList})
})

router.get('/:groupId/venues',
  [restoreUser, requireAuth],
  async (req, res) => {
    let { user } = req
    user = user.toJSON()
  if(!user) {
    res.status(403)
    res.json({
      message: 'Forbidden',
      statusCode: 403
    })
  }

  const group = await Group.findByPk(req.params.groupId)
  if(!group) {
    res.status(404)
    res.json({
      message: "Group couldn't be found",
      statusCode: 404
    })
  }
  const isGroup = group.toJSON()
  const member = await Membership.findOne({
    where: {
      userId: user.id,
      status: 'co-host'
    }
  })

  if (isGroup.organizerId === user.id || member) {
    const venues = await Venue.scope('defaultScope').findAll({
      where: {
        groupId: req.params.groupId
      },

    })
    res.json(venues)
  } else {
    res.status(403)
    res.json({
      message: 'Forbidden',
      statusCode: 403
    })
  }

  })

router.post('/:groupId/events',
  [requireAuth, validateEvent],
  async (req, res) => {
    let { user } = req
    user = user.toJSON()
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
  const member = await Membership.findOne({
      where: {
      userId: user.id,
      status: 'co-host'
    }
  })
  const group = await Group.findByPk(req.params.groupId)
  if(!group) {
    res.status(404)
    res.json({
      message: "Group couldn't be found",
      statusCode: 404
    })
  }
  const isGroup = group.toJSON()
  if(isGroup.organizerId === user.id || member) {
    const event = await Event.create({
      groupId: +req.params.groupId,
      venueId: venueId,
      name: name,
      type: type,
      capacity: capacity,
      price: price,
      description: description,
      startDate: startDate,
      endDate: endDate
    })
    res.json({
      id: event.id,
      groupId: event.groupId,
      venueId: event.venueId,
      name: event.name,
      type: event.type,
      capacity: event.capacity,
      price: event.price,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate
    })
  } else {
    res.status(403)
    res.json({
      message: 'Forbidden',
      statusCode: 403
    })
  }
  })

router.get('/current',
  requireAuth,
  async (req, res) => {
    let { user } = req;
    user = user.toJSON()
    const groups = await Group.findAll({
      where: {
        organizerId: user.id
      },
      include: {
        model: GroupImage
      }
    })
    const groupList = []
    groups.forEach(group => {
      groupList.push(group.toJSON())
    })
    // const isMember = await Membership.findAll({
    //   where: {
    //     userId: user.id
    //   },
    //   attributes: [],
    //   include: {
    //     model: Group
    //   }
    // })
    // isMember.forEach(member => {
    //   groupList.push(member.toJSON())
    // })
    const numMembers = async () => {
      for (let group of groupList) {
        const members = await Membership.count({
          where: {
            groupId: group.id
          }
        })
      group.numMembers = members;
      }
    }
    await numMembers()
    groupList.forEach(group => {
      group.GroupImages.forEach(image => {
        if (image.preview === true) {
          group.previewImage = image.url
        }
      })
      if(!group.previewImage) {
        group.previewImage = 'no preview image'
      }
      delete group.GroupImages
    })


    res.json({
      Groups: groupList
    })
  })

router.get('/:groupId', async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: GroupImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User
      },
      {
        model: Venue
      }
    ]
  })
  if (!group) {
    res.status(404)
    res.json({
      message: "Group couldn't be found",
      statusCode: 404
    })
  }
  const organizer = await User.findOne({
    where: {
      id: group.organizerId,
    },
    attributes: [ 'id', 'firstName', 'lastName' ]
  })
  const venues = await Venue.findAll({
    where: {
      groupId: req.params.groupId
    },
    attributes: [ 'id', 'groupId', 'address', 'city', 'state', 'lat', 'lng' ]
  })
  const members = async () => {
    const total = await Membership.count({
      where: {
        groupId: group.id,
        status: {
          [Op.or]:['co-host', 'member']
        }
      }
    })
    group.numMembers = total
  }
  await members()
  res.json({
    id: group.id,
    organizerId: group.organizerId,
    name: group.name,
    about: group.about,
    type: group.type,
    private: group.private,
    city: group.city,
    state: group.state,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    numMembers: group.numMembers,
    GroupImages: group.GroupImages,
    Organizer: organizer,
    Venues: venues
  }
  )
})

router.post('/:groupId/images',
  [restoreUser, requireAuth,],
  async (req, res) => {
    let { user } = req;
    user = user.toJSON()
    const { url, preview } = req.body;

    if(!user) {
      res.status(403)
      res.json({
        message: "Forbidden",
        statusCode: 403
      })
    }
    const group = await Group.findByPk(req.params.groupId)
    if(!group) {
      res.status(404)
      res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
    const isGroup = group.toJSON()
    if(isGroup.organizerId === user.id) {
      const image = await GroupImage.create({
        url: url,
        groupId: isGroup.id,
        preview: preview
      })

      res.json({
        id: image.id,
        url: image.url,
        preview: image.preview
      })
    } else {
      res.status(403)
      res.json({
          message: "Forbidden",
          statusCode: 403
      })
    }
  })

router.post('/:groupId/venues',
  [restoreUser, requireAuth, validateVenue],
  async (req, res) => {
    let { user } = req
    user = user.toJSON()
    const { address, city, state, lat, lng } = req.body
  const member = await Membership.findOne({
    where: {
      userId: user.id,
      status: 'co-host'
    }
  })

  const group = await Group.findByPk(req.params.groupId)
  if(!group) {
    res.status(404)
    res.json({
      message: "Group couldn't be found",
      statusCode: 404
    })
  }
  const isGroup = group.toJSON()
  if (isGroup.organizerId === user.id || member) {
    const venue = await Venue.create({
      groupId: req.params.groupId,
      address: address,
      city: city,
      state: state,
      lat: lat,
      lng: lng
    })
    res.json({
      id: venue.id,
      groupId: venue.groupId,
      address,
      city,
      state,
      lat,
      lng
    })
  } else {
    res.status(403)
    res.json({
      message: "Forbidden",
      statusCode: 403
    })
  }
  })

router.post('/',
  [requireAuth, validateGroup],
  async (req, res) => {
    let { user } = req
    user = user.toJSON()
    const { name, about, type, private, city, state } = req.body;

    const group = await Group.create({
      organizerId: user.id,
      name,
      about,
      type,
      private,
      city,
      state
    })
    return res.json(group)
  })

  router.put('/:groupId',
    [requireAuth, restoreUser, validateGroup],
    async (req, res) => {
      let { user } = req
      user = user.toJSON()
      const { name, about, type, private, city, state } = req.body
      const group = await Group.findByPk(req.params.groupId)

      if(!group) {
        res.status(404)
        res.json({
          message: "Group couldn't be found",
          statusCode: 404
        })
      }
      const isGroup = group.toJSON()
      if(isGroup.organizerId === user.id) {
        if(name) group.name = name;
        if(about) group.about = about;
        if(type) group.type = type;
        if(private) group.private = private;
        if(city) group.city = city;
        if(state) group.state = state;

        await group.save()

        res.json(group)
      } else {
        res.status(403)
        res.json({
          message: 'Forbidden',
          statusCode: 403
        })
      }
    })

  router.get('/:groupId/events',
    async (req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    const events = await Event.findAll({
      where: {
        groupId: req.params.groupId,
      },
      include: [
        {
          model: EventImage
        },
        {
          model: Group,
          attributes: [
            'id', 'name', 'city', 'state'
          ]
        },
        {
          model: Venue,
          attributes: [
            'id', 'city', 'state'
          ]
        },
      ],
    })
    if (!group) {
      res.status(404)
      res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
    const eventList = []
    events.forEach(event => {
      eventList.push(event.toJSON())

    });
    const numAttending = async () => {
      for (let event of eventList) {
        const attendees = await Attendance.count({
          where: {
            eventId: event.id
          }
        })
        event.numAttending = attendees
      }
    }
    await numAttending()
    eventList.forEach(event => {
      event.EventImages.forEach(image => {
        if (image.preview === true) {
          event.previewImage = image.url
        }
      })
      if (!event.previewImage) {
        event.previewImage = 'no preview image found'
      }
      delete event.EventImages
      delete event.createdAt
      delete event.updatedAt
    })
    const dataArr = []
    eventList.forEach(event => {
      const data = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending: event.numAttending,
        previewImage: event.previewImage,
        Group: event.Group,
        Venue: event.Venue
      }
      dataArr.push(data)
    })

    res.json({Events: dataArr
    })
    })

  router.delete('/:groupId',
    [requireAuth, restoreUser],
    async (req, res) => {
      let { user } = req;
      user = user.toJSON()

    if (user) {
      const deleteGroup = await Group.findByPk(req.params.groupId)
      if(!deleteGroup) {
        res.status(404)
        res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
    }
      const isGroup = deleteGroup.toJSON()

      if(user.id === isGroup.organizerId) {


        await deleteGroup.destroy()

        res.json({
          message: 'Successfully deleted',
          statusCode: 200
        })
      } else {
        res.status(401)
        res.json({
          message: 'Authentication required',
          statusCode: 401
        })
      }
    }
    })


module.exports = router;