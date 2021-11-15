const User = require('../models/User');
// const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {secret} = require("../config");

const generateAccessToken = (id, username) => {
    const payload = {
        id,
        username
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(409).json({message: "Registration error", errors})
            } else {
                const {username, password} = req.body;
                const candidate = await User.findOne({username})
                if (candidate) {
                    return res.status(409).json({message: "The user has already exist with this username"})
                }
                const hashPassword = bcrypt.hashSync(password, 10);
                // const userRole = await Role.findOne({value: "USER"})
                // const user = new User({username, password: hashPassword, roles: [userRole.value]})
                const user = new User({username, password: hashPassword})
                await user.save()
                return res.status(200).json({ message: "The user is registered is success" })
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if (!candidate) {
                return res.status(404).json({message: `The user ${username} is not found`})
            }
            const validPassword = bcrypt.compareSync(password, candidate.password)
            if (!validPassword) {
                return res.status(401).json({message: `The password is incorrect`})
            }
            const token = generateAccessToken(candidate._id, candidate.username)
            return res.status(200).json({token: `Bearer ${token}`})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Login error'})
        }
    }

    // async getUsers(req, res) {
    //     try {
    //         const userRole = new Role();
    //         const adminRole = new Role({value: "ADMIN"})
    //         await userRole.save()
    //         await adminRole.save()
    //         // const users = await User.find()
    //         res.json('server work')
    //         // res.json(users)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

module.exports = new authController()
