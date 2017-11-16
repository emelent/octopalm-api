import express from 'express'
import {graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import models from './models'
import makeAuthRouter from './routers/auth'
import makeGraphqlRouter from './routers/graphql'
import configureMongoose from './mongoose.config'

configureMongoose(mongoose)

//cors middleware
const cors = (req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*')
	res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.set('Content-Type', 'application/json')
	if(req.method === 'OPTIONS')
		res.sendStatus(200)
	else
		next()
}

const app = express()

// attach middleware
app.use(cors)
app.use(bodyParser.json())

//attach authentication router
app.use('/auth', makeAuthRouter(models))

//attach graphql router
app.use('/graphql', makeGraphqlRouter(models))

//attach graphiql
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

// start listening
const port = parseInt(process.env.PORT) || 5000
const host = process.env.HOST || '0.0.0.0'
app.listen(port, host, () => {
	console.log(`Listening on ${host}:${port}`)
})
