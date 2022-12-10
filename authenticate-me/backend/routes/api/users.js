const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Please provide a valid first name.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Please provide a valid last name.'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const emailExists = await User.findOne({
      where: {
        email: email
      }
    })

    if (emailExists) {
      res.status(403)
      return res.json({
        message: 'User already exists',
        statusCode: 403,
        errors: {
          email: 'User with that email already exists'
        }
      })
    }
    const user = await User.signup({ firstName, lastName, email, password });

    const token = await setTokenCookie(res, user);

    return res.json({ user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: token
    }
    });
  }
);

module.exports = router;
