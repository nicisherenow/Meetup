const express = require('express')

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Membership, Venue, Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
  check('venueId')
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'),
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
  const groups = await Group.findAll()

  res.json(groups)
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
  [requireAuth],
  async (req, res) => {
    let { user } = req;
    user = user.toJSON()
  if (user) {
    const groups = await Group.findAll({
      where: {
        organizerId: user.id
      },
      include: {
        model: GroupImage
      }
    })

    res.json({
      Groups: groups
    })
    }
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

  router.delete('/:groupId/image')

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
