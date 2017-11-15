import express from 'express'
import {createApiToken, createToken, validateToken, hashPassword, inflateId} from '../utils'


const fail = (res, code, msg) => res.status(code).json(msg)

const makeRouter = ({User}) => {
	const router = express.Router()
	router.post(`/token`, async (req, res) => {
		if(!req.body.password || !req.body.student_id)
			return fail(res, 422, `No password or student_id provided.`)
		req.body.password = hashPassword(req.body.password)
		const user = await User.findOne(req.body).exec()
		if(!user)
			fail(res, 403, `Invalid login credentials.`)
		const _id = user._id.toString()
		const ua = req.get(`user-agent`)
		res.json(createApiToken(_id, ua))
	})

	router.post(`/register`, async (req, res) => {
		req.body.password = hashPassword(req.body.password)
		
		try{
			const user = await new User(req.body).save()
			if(!user)
				return fail(res, 401, `Hmmm... what are you trying to do?`)
			const _id = user._id.toString()
			const ua = req.get(`user-agent`)
			
			res.json(createApiToken(_id, ua))
		}catch(e){
			return fail(res, 401, `Duplicate student number.`)
		}
	})

	router.all(`/refresh`, async (req, res) => {
		const ua = req.get(`user-agent`)
		const bearer = req.get(`authorization`)
		const badToken = () => fail(res, 403, `Invalid token.`)

		if(!bearer)
			return badToken()
			
		const oldToken = bearer.split(` `)[1]
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

		res.json(createApiToken(payload._id, ua))
	})	

	return router
}


export default makeRouter