export {};
require('dotenv').config();
require('../config/db.js');
const jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT_TOKEN1;
const express = require('express');
const UserModel = require('../models/User');
const userToken = require('../services/userToken');
const UserRouter = express.Router();
const { generateHash, compareHash } = require('../services/Hash.js');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ status: 'Invalid user' });
    }
    jwt.verify(token, jwtkey, err => {
        if (err) {
            return res.status(403).json({ status: 'Invalid Token' });
        }
        next();
    });
};
/**
 * @swagger
 * components:
 *   securitySchemes:
 *         bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *           - Name
 *           - email
 *           - password
 *       properties:
 *         uuid:
 *           type: string
 *           description: The auto-generated id of the Users
 *         Name:
 *           type: string
 *           description: The User's Name
 *         email:
 *           type: string
 *           description: The User's email
 *         password:
 *           type: string
 *           description: The User's pasword
 *       example:
 *            uuid: asfghdfg587adf
 *            Name: Mohammed
 *            email: mk@gmail.com
 *            password: password123
 *
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The USERS managing API
 */

/**
 * @swagger
 * /user/users:
 *   get:
 *     security:
 *          - bearerAuth: []
 *     summary: Returns the list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the Users
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#components/schemas/User'
 *       401:
 *          description: UnAuthorized User
 *       403:
 *          description: Invalid Token
 *       500:
 *         description: Internal server Error
 */

UserRouter.get('/users', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.find({});
        res.status(200).json({ user });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server Error');
    }
})
    /**
     * @swagger
     * /user/Newuser:
     *   post:
     *     summary: Create a new USer
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *                $ref: '#components/schemas/User'
     *     responses:
     *       200:
     *         description: The User was successfully created
     *         content:
     *           application/json:
     *                $ref: '#components/schemas/User'
     *       400:
     *         description: Email already Exist
     *       500:
     *         description: Internal server Error
     */ .post('/Newuser', async (req, res) => {
        const { Name, email, password } = req.body;
        const userDetails = {
            Name,
            email,
            password,
        };
        try {
            // since we use await we need to use try-catch block
            const checkUser = await UserModel.findOne({ email: email });
            if (checkUser) {
                res.status(400).json({ result: 'Email Already Exist' });
            } else {
                const result = await new UserModel({
                    Name: userDetails.Name,
                    email: userDetails.email,
                    passwordHash: await generateHash(userDetails.password),
                }).save();
                res.status(200).json({ result });
            }
        } catch (e) {
            console.error(e);
        }
    })
    /**
     * @swagger
     * /user/login:
     *   post:
     *     summary: login User
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *             schema:
     *                $ref: '#components/schemas/User'
     *     responses:
     *       200:
     *         description: The User was successfully loggedin
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid Email/password
     *       500:
     *         description: Internal server Error
     *
     */ .post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const userDetails = await UserModel.findOne({ email }).exec();
            if (userDetails) {
                const result = await compareHash(password, userDetails.passwordHash);
                if (result) {
                    const Token = userToken(email);
                    res.status(200).json({ status: 'success', token: Token });
                } else {
                    res.status(400).json({ status: 'Invalid user/password' });
                }
            } else {
                res.status(400).json({ status: 'Invalid user/password' });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: 'Internal server Error' });
        }
    });

module.exports = UserRouter;
