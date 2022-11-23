const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Membership, Group, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId',
  requireAuth,
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
      model: GroupImage,
      where: {id: req.params.imageId}
    }
  })
  if(!group) {
    res.status(404)
    res.json({
      message: "Group Image couldn't be found",
      statusCode: 404
    })
  }
  const isGroup = group.toJSON()
  const image = await GroupImage.findByPk(req.params.imageId)
  if(!image) {
    res.status(404)
    res.json({
      message: "Group Image couldn't be found",
      statusCode: 404
    })
  }
  const isImage = image.toJSON()
  if (isGroup.id === isImage.groupId || member) {
    await image.destroy()
    res.json({
      message: 'Successfully deleted',
      statusCode: 200
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
