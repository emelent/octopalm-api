import {GraphQLError} from 'graphql'
import {gqlModule} from '../transformers'
import {inflateId} from '../../utils'
const ObjectId = require('mongoose').Types.ObjectId

export default {
	Query:{
		modules: async(parent, args, {Module}) => {
			const modules = await Module.find(args).exec()
			return modules.map(x => gqlModule(x))
		},
		module: async(parent, args, {Module}) => {
			const x = await Module.findOne(args).exec()
			return gqlModule(x)
		},
	},
	Mutation: {
		createModule: async(parent, args, {Module}) => {
			const x = await new Module(args).save()
			return gqlModule(x)
		},
		updateModule: async(parent, args, {Module}) => {
			const _id = ObjectId.createFromHexString(args._id)
			delete args._id
			const x = await Module.findByIdAndUpdate(_id, args).exec()
			return gqlModule(x)
		},
		deleteModule: async(parent, args, {Module}) => {
			const _id = ObjectId.createFromHexString(args._id)
			const x = await Module.findByIdAndRemove(_id).exec()
			return gqlModule(x)
		},
	}
}