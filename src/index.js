import express from 'express'
import {graphiqlExpress} from 'apollo-server-express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import {dbUrl, port} from './constants'
import models from './models'
import makeAuthRouter from './routers/auth'
import makeGraphqlRouter from './routers/graphql'


//set mongoose to return standard Javascript Promises instead of Mongoose promises
//so we can use await/async stuff.
mongoose.Promise =  global.Promise
mongoose.connect(dbUrl, {useMongoClient: true})


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
app.use(cors)
app.use(bodyParser.json())

//attach authentication router
app.use('/auth', makeAuthRouter(models))

//attach graphql router
app.use('/graphql', makeGraphqlRouter(models))

//attach graphiql
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));


app.listen(port, () => {
	console.log(`Listening on :${port}`)
})
