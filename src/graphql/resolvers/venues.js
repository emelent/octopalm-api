import {GraphQLError} from 'graphql'
import {gqlVenue} from '../transformers'
import {inflateId} from '../../utils'

const ObjectId = require('mongoose').Types.ObjectId

export default{
	Query:{
		venues: async(parent, args, {Venue}) => {
			const venues = await Venue.find(args)
			return venues.map(x => gqlVenue(x))
		},
		venue: async (parent, args, {Venue}) => {
			const x = await Venue.findOne(args)
			return gqlVenue(x)
		}
	},
	Mutation:{
		createVenue: async (parent, args, {Venue}) => {
			const x = await new Venue(args).save()
			return gqlVenue(x)
		},
		updateVenue: async (parent, args, {Venue}) => {
			const _id = ObjectId.createFromHexString(args._id)
			delete args._id
			const x = await Venue.findByIdAndUpdate(_id, args)
			return gqlModule(x)
		},
		deleteVenue: async (parent, args, {Venue}) => {
			const _id = ObjectId.createFromHexString(args._id)
			const x = await Venue.findByIdAndRemove(_id)
			return gqlModule(x)
		},
	}
}