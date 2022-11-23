const express = require('express')

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Group, User, GroupImage, Membership } = require('../../db/models');
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

router.get('/', async (req, res) => {
  const groups = await Group.findAll()

  res.json(groups)
})

router.get('/current',
  [restoreUser, requireAuth],
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

router.post('/',
  [restoreUser, requireAuth, validateGroup],
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
        res.json({
          message: 'Authentication required',
          statusCode: 401
        })
      }
    })

  router.delete('/:groupId',
    [requireAuth, restoreUser],
    async (req, res) => {
      let { user } = req;
      user = user.toJSON()

    if (user) {
      const deleteGroup = await Group.findByPk(req.params.groupId)
      if(!deleteGroup) res.json({
        message: "Group couldn't be found",
        statusCode: 404
      })
      const isGroup = deleteGroup.toJSON()

      if(user.id === isGroup.organizerId) {


        await deleteGroup.destroy()

        res.json({
          message: 'Successfully deleted',
          statusCode: 200
        })
      } else {
        res.json({
          message: 'Authentication required',
          statusCode: 401
        })
      }
    }
    })


module.exports = router;
