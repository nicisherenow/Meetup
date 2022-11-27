const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Membership, Group, EventImage, Event, Venue, Attendance } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const router = express.Router();

const validateEvent = [
  check('venueId')
    .exists()
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
    .exists({ checkFalsy: true})
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

router.post('/:eventId/images',
  requireAuth,
  async (req, res) => {
  const userId = req.user.id
  const { url, preview } = req.body
  const event = await Event.findByPk(req.params.eventId)
  if (!event) {
    res.status(404)
    res.json({
      message: "Event couldn't be found",
      statusCode: 404
    })
  }
  const isEvent = event.toJSON()
  const group = await Group.findOne({
    where: {
      id: isEvent.groupId
    }
  })
  const attendee = await Attendance.findOne({
    where: {
      userId: userId,
      status: 'attending'
    }
  })
  const isGroup = group.toJSON()
  if (isGroup.organizerId === userId || attendee) {
    const image = await EventImage.create({
      eventId: +req.params.eventId,
      url: url,
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
      message: 'Forbidden',
      statusCode: 403
    })
  }
})

router.put('/:eventId/attendance',
  requireAuth, async (req, res) => {
  const userID = req.user.id;
  const { userId, status } = req.body
  const event = await Event.findByPk(req.params.eventId)
  if(!event) {
    res.status(404)
    res.json({
      message: "Event couldn't be found",
      statusCode: 404
    })
  }
  const isAttendingEvent = await Attendance.findOne({
    where: {
      userId: userId,
      eventId: event.id
    }
  })
  if(!isAttendingEvent) {
    res.status(404)
    res.json({
      message: "Attendance between user and the event does not exist",
      statusCode: 404
    })
  }
  if(status === 'pending') {
    res.status(400)
    res.json({
      message: "Cannot change an attendance status to pending",
      statusCode: 400
    })
  }
  const isOrganizer = await Group.findOne({
    where: {
      organizerId: userID,
      id: event.groupId
    }
  })
  const isCohost = await Group.findOne({
    where: {
      id: event.groupId,
    },
    include: {
      model: Membership,
      where: {
        userId: userID,
        status: 'co-host'
      }
    }
  })
  if (isOrganizer || isCohost) {
    isAttendingEvent.status = status;
    await isAttendingEvent.save()
    res.json({
      id: isAttendingEvent.id,
      eventId: isAttendingEvent.eventId,
      userId: isAttendingEvent.userId,
      status: isAttendingEvent.status
    })
  } else {
    res.status(403)
    res.json({
      message: "Forbidden",
      statusCode: 403
    })
  }
  })

router.get('/:eventId/attendees', async (req, res) => {
  const userId = req.user.id
  const event = await Event.findByPk(req.params.eventId)
  if(!event) {
    res.status(404)
    res.json({
      message: "Event couldn't be found"
    })
  }
  const isOrganizer = await Group.findOne({
    where: {
      organizerId: userId,
      id: event.groupId,
    }
  })
  const isCohost = await Group.findOne({
    where: {
      id: event.groupId,
    },
    include: {
      model: Membership,
      where: {
        userId: userId,
        status: 'co-host'
      }
    }
  })
  if (isOrganizer || isCohost) {
    const allAttendees = await User.findAll({
      attributes: ['id', 'firstName', 'lastName'],
      include: {
        model: Attendance,
        attributes: ['status'],
        where: {
          eventId: event.id
        }
      }
    })
    const attendanceList = []
    allAttendees.forEach(attendee => {
      attendanceList.push(attendee.toJSON())
    })
    attendanceList.forEach(attendee => {
      const attends = attendee.Attendances.pop()
      attendee.Attendance = attends
      delete attendee.Attendances
    })
    res.json(attendanceList)
  } else {
    const allAttendees = await User.findAll({
      attributes: ['id', 'firstName', 'lastName'],
      include: {
        model: Attendance,
        attributes: ['status'],
        where: {
          eventId: event.id,
          status: {
            [Op.in]: ['waitlist', 'attending']
          }
        }
      }
    })
    const attendanceList = []
    allAttendees.forEach(attendee => {
      attendanceList.push(attendee.toJSON())
    })
    attendanceList.forEach(attendee => {
      const attends = attendee.Attendances.pop()
      attendee.Attendance = attends
      delete attendee.Attendances
    })
    res.json(attendanceList)
  }
})

router.post('/:eventId/attendance',
  requireAuth, async (req, res) => {
  const userId = req.user.id;
  const event = await Event.findByPk(req.params.eventId)
  if(!event) {
    res.status(404)
    res.json({
      message: "Event couldn't be found",
      statusCode: 404
    })
  }
  const group = await Group.findOne({
    where: {
      id: event.groupId,
    },
    include: {
      model: Membership,
      where: {
        userId: userId
      }
    }
  })
  if (!group) {
    res.status(403)
    res.json({
      message: "Forbidden",
      statusCode: 403
    })
  }
  const isPending = await Attendance.findOne({
    where: {
      userId: userId,
      eventId: event.id,
      status: 'pending'
    }
  })
  if(isPending) {
    res.status(400)
    res.json({
      message: "Attendance has already been requested",
      statusCode: 400
    })
  }
  const isAttending = await Attendance.findOne({
    where: {
      userId: userId,
      eventId: event.id,
      status: 'attending'
    }
  })
  if(isAttending) {
    res.status(400)
    res.json({
      message: "User is already an attendee of the event",
      statusCode: 400
    })
  }
  if (!isAttending && !isPending && group) {
    const attendee = await Attendance.create({
      userId: userId,
      eventId: event.id
    })
    res.json({
      userId: attendee.userId,
      status: attendee.status
    })
  }
  })

router.put('/:eventId',
  [requireAuth, validateEvent],
  async (req, res) => {
  const userId = req.user.id;
  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  if (!event) {
    res.status(404)
    res.json({
      message: "Event couldn't be found",
      statusCode: 404
    })
  }
  const venue = await Venue.findOne({
    where: {
      id: venueId
    }
  })
  if(!venue) {
    res.status(404)
    res.json({
      message: "Venue couldn't be found",
      statusCode: 404
    })
  }
  const member = Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: userId,
      status: 'co-host'
    }
  })
  const group = await Group.findOne({
    where: {
      organizerId: userId,
      id: req.params.eventId
    }
  })
  if (group || member) {
    if(venueId) event.venueId = venueId;
    if(name) event.name = name;
    if(type) event.type = type;
    if(capacity) event.capacity = capacity;
    if(price) event.price = price;
    if(description) event.description = description;
    if(startDate) event.startDate = startDate;
    if(endDate) event.endDate = endDate;
    await event.save()

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

router.get('/:eventId',
  async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Group,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'type', 'organizerId', 'about']
        }
      },
      {
        model: Venue,
        attributes: {
          exclude: ['groupId', 'createdAt', 'updatedAt']
        }
      },
      {
        model: EventImage,
        attributes: {
          exclude: ['eventId', 'createdAt', 'updatedAt']
        }
      }
    ]
  })
  if (!event) {
    res.status(404)
    res.json({
      message: "Event couldn't be found",
      statusCode: 404
    })
  }
  const attending = await Attendance.count({
    where: {
      eventId: event.id
    }
  })
  res.json({
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    description: event.description,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    startDate: event.startDate,
    endDate: event.endDate,
    numAttending: attending,
    Group: event.Group,
    Venue: event.Venue,
    EventImages: event.EventImages
  })
})


router.get('/', async (req, res) => {
  const events = await Event.findAll({
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

module.exports = router;
