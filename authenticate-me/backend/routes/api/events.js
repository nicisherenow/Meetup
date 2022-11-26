const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Membership, Group, EventImage, Event, Venue, Attendance, sequelize, Op } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const user = require('../../db/models/user');

const router = express.Router();

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
      status: 'member'
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
