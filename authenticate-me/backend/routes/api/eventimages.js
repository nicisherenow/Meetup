const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Membership, Group, EventImage, Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId',
  requireAuth, async (req, res) => {
  const userId = req.user.id;
  const image = await EventImage.findByPk(req.params.imageId)
  if (!image) {
    res.status(404)
    res.json({
      message: "Event Image couldn't be found",
      statusCode: 404
    })
  }
  const isOrganizer = await Group.findOne({
    where: {
      organizerId: userId,
    },
    include: {
      model: Event,
      where: {
        id: image.eventId
      }
    }
  })
  const isCohost = await Group.findOne({
    include: [
      {
        model: Membership,
        where: {
          userId: userId,
          status: 'co-host'
        }
      },
      {
        model: Event,
        where: {
          id: image.eventId
        }
      }
    ]
  })
  if(isOrganizer || isCohost) {
    await image.destroy()
    res.json({
      message: "Successfully deleted"
    })
  } else {
    res.status(403)
    res.json({
      message: "Forbidden",
      statusCode: 403
    })
  }
})

module.exports = router;
