const express = require('express')
const bodyParser = require('body-parser')
const {createToken, validateToken, hashPassword, inflateId} = require('./utils')

const expiresIn = '2d'

const fail = (res, code, msg) => res.status(code).json(msg)

/**
 * Creates a new json webt token with the expiray date set to the value
 * in the expiresIn constant.
 *  
 * @param {String} _id 		- User Id string
 * @param {String} ua		- User agent string
 * 
 * @return {Object}
 */
const newToken = (_id, ua) => ({token: createToken({_id, ua}, {expiresIn})})

/**
 * 
 * @param {mongoose.Connection} db 	- Mongoose database connection
 * @param {mongoose.User} User 		- User mongoose schema
 * 
 * @return express.Router
 */
const makeRouter = (db, User) => {
	const router = express.Router()

	router.use(bodyParser.json())

	router.post('/token', async (req, res) => {
		if(!req.body.password || !req.body.student_id)
			return fail(res, 422, "No password or student_id provided.")
		req.body.password = hashPassword(req.body.password)
		const user = await User.findOne(req.body).exec()
		if(!user)
			fail(res, 403, "Invalid login credentials.")
		const _id = user._id.toString()
		const ua = req.get('user-agent')
		res.json(newToken(_id, ua))
	})
	router.post('/register', async (req, res) => {
		req.body.password = hashPassword(req.body.password)
		const user = await new User(req.body).save()
		if(!user)
			return fail(res, 401, "Hmmm... what are you trying to do?")
		const _id = user._id.toString()
		const ua = req.get('user-agent')
		
		res.json(newToken(_id, ua))
	})
	router.all('/refresh', async (req, res) => {
		const ua = req.get('user-agent')
		const bearer = req.get('authorization')
		const badToken = () => fail(res, 403, "Invalid token.")

		if(!bearer)
			return badToken()
			
		const oldToken = bearer.split(' ')[1]
		const payload = validateToken(oldToken, {ignoreExpiration: true})

		if(!payload || payload.ua !== ua)
			return badToken()

		const user = await User.findById(inflateId(payload._id))
		if(!user)
			return badToken()

		delete payload.iat
		delete payload.exp
		delete payload.nbf
		delete payload.jti 

		res.json(newToken(payload._id, ua))
	})	

	return router
}


module.exports = makeRouter