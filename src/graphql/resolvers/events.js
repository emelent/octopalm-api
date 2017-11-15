import {GraphQLError} from 'graphql'
import {gqlEvent} from '../transformers'
import {inflateId} from '../../utils'
const ObjectId = require('mongoose').Types.ObjectId

export default {
	Query:{
		events: async(parent, args, {Event}) => {
			if(args.venue && isHex(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const events = await Event.find(args)
			return events.map(x => gqlEvent(x))
		},
		event: async(parent, args, {Event}) => {
			const x = await Event.findById(inflateId(args._id))
			return gqlEvent(x)
		},
	},
	Mutation:{
		createEvent: async(parent, args, {Event}) => {
			if(args.venue && isHex(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const x = await new Event(args).save()
			return gqlEvent(x)
		},
		updateEvent: async(parent, args, {Event}) => {
			if(args.venue && isHex(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const _id = ObjectId.createFromHexString(args._id)
			delete args._id
			const x = await Event.findByIdAndUpdate(_id, args)
			return gqlEvent(x)
		},
		deleteEvent: async(parent, args, {Event}) => {
			const _id = ObjectId.createFromHexString(args._id)
			const x = await Event.findByIdAndRemove(_id)
			return gqlEvent(x)
		},
	}
}