import {config} from 'dotenv'
import mongoose from 'mongoose'

import configureMongoose from '../../src/mongoose.config'
import seedEvents from './events'
import seedModules from './modules'
import seedTimetables from './timetables'
import seedUsers from './users'
import seedVenues from './venues'


// set up environment
const ENV = 'development'
process.env.BABEL_ENV = ENV
process.env.NODE_ENV = ENV
config({path: `.env.${ENV}`})


// connect to db
configureMongoose(mongoose)

// these are ordered according to dependencies
// and have to run a certain order.
seedModules(20)
seedUsers(10)
seedVenues(20)
seedEvents(20)
seedTimetables(20)

// disconnect to db
mongoose.disconnect()