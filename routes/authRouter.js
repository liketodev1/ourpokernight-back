const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const {check} = require("express-validator");
// const authMiddleware = require('../middlewaree/authMiddleware');
// const roleMiddleware = require('../middlewaree/roleMiddleware');

router.post('/registration', [
    check('username', "The username field can not be empty").notEmpty(),
    check('password', "The password should be min 4 symbol and max 10 symbol").isLength({min:4, max:10})
], controller.registration)
router.post('/login', controller.login)
// router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

module.exports = router
