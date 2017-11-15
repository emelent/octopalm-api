import {GraphQLError} from 'graphql'
import {gqlVenue} from '../transformers'
import {inflateId} from '../../utils'

const ObjectId = require('mongoose').Types.ObjectId

export default{
	Query:{
		venues: async(parent, args, {Venue}) => {
			const venues = await Venue.find(args).exec()
			return venues.map(x => gqlVenue(x))
		},
		venue: async (parent, args, {Venue}) => {
			const x = await Venue.findOne(args).exec()
			return gqlVenue(x)
		},
		emptyVenues: async (parent, args, {Venue, Event}) => {
			//get all events happening now
			const events = await Event.find().where('end')
				.gt(args.time).exec()
				// .gt(args.time).exec()
			console.log(`events at ${args.time} =>`, events)
			const venueIds = events.map(x => x._id.toString())
			console.log('venueIds >', venueIds)
			// get all venues with id's not found in array
			// i.e, the venues not being used
			let venues = await Venue.find().exec()
			venues.forEach(x => {
				if(venueIds.indexOf(x._id.toString()) > -1)
					console.log(x._id)
				else
					console.log('nope')
			})
			// console.log('venues =>', venues)
			return venues.map(x => gqlVenue(x))
		},
	},
	Mutation:{
		createVenue: async (parent, args, {Venue}) => {
			const x = await new Venue(args).save()
			return gqlVenue(x)
		},
		updateVenue: async (parent, args, {Venue}) => {
			const _id = ObjectId.createFromHexString(args._id)
			delete args._id
			const x = await Venue.findByIdAndUpdate(_id, args).exec()
			return gqlModule(x)
		},
		deleteVenue: async (parent, args, {Venue}) => {
			const _id = ObjectId.createFromHexString(args._id)
			const x = await Venue.findByIdAndRemove(_id).exec()
			return gqlModule(x)
		},
	}
}