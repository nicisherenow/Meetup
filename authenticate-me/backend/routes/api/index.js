const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js')
const groupImagesRouter = require('./groupimages.js')
const venuesRouter = require('./venues.js')
const eventsRouter = require('./events.js')
const eventImagesRouter = require('./eventimages')
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter)

router.use('/group-images', groupImagesRouter)

router.use('/venues', venuesRouter)

router.use('/events', eventsRouter)

router.use('/event-images', eventImagesRouter)

module.exports = router;
