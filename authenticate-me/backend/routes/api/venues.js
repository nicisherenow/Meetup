const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Membership, Group, GroupImage, Venue } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

router.put('/:venueId',
  [requireAuth, validateVenue],
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
  const group = await Group.findOne({
    where: {
      organizerId: user.id
    },
    include: {
      model: Venue,
      where: {
        id: req.params.venueId
      }
    },
  })
  if(!group) {
    res.status(404)
    res.json({
      message: "Venue couldn't be found",
      statusCode: 404
    })
  }
  const isGroup = group.toJSON()
  const venue = await Venue.findByPk(req.params.venueId)
  const isVenue = venue.toJSON()
  if(isGroup.id === isVenue.groupId || member) {
    if(address) venue.address = address
    if(city) venue.city = city
    if(state) venue.state = state
    if(lat) venue.lat = lat
    if(lng) venue.lng = lng
    await venue.save()

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
      message: 'Forbidden',
      statusCode: 403
    })
  }
  })

module.exports = router;
