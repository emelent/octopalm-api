import {config} from 'dotenv'
import mongoose from 'mongoose'

import configureMongoose from '../../src/mongoose.config'
import seedEvents from './events'
import seedModules from './modules'
import seedTimetables from './timetables'
import seedUsers from './users'
import seedVenues from './venues'


// set up environment
config({path: `.env.${process.env.NODE_ENV}`})


async function seed(){

	// connect to db
	configureMongoose(mongoose)

	// these are ordered according to dependencies
	// and have to run a certain order.
	try {
		await seedModules()
		await seedUsers()
		await seedVenues()
		await seedEvents()
		await seedTimetables()
	} catch (e){
		throw e
	} finally {
		// disconnect to db
		mongoose.disconnect()
	}
}

seed().then(() => console.log(`${process.env.NODE_ENV.toString()} database seeded.`))
	.catch(err => console.log(`Seeding failed: ${err}`))