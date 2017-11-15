import {GraphQLError} from 'graphql'
import {gqlUser} from '../transformers'
import {inflateId, hashPassword} from '../../utils'

const ObjectId = require('mongoose').Types.ObjectId

export default {
	Query: {
		user: async(parent, args, {User}) => {
			const x = await User.findOne(args).exec()
			return gqlUser(x)
		},
		users: async(parent, args, {User}) => {
			const users = await User.find().exec()
			return users.map(x => gqlUser(x))
		},
	},
	Mutation: {

		updateUser: async (parent, args, {User}) => {
			//check if user is admin or owner
			const {_id, modules, timetables, name, group} = args
			const x = await User.findById(inflateId(_id)).exec()
			if(modules){
				x.modules = modules.map(x => inflateId(x))
			}
			if(timetables){
				x.timetables = timetables.map(x => inflateId(x))
			}
			if(name){
				x.name = name
			}
			if(group){
				//TODO check if admin
				x.group = group
			}
			return x.save().then(x => gqlUser(x))
		},
		updatePassword: async (parent, args, {User}) => {
			const _id = inflateId(args._id)
			const hash = hashPassword(args.password)
			const user = await User.findById(_id).exec()

			if(user.password !== hash)
				return GraphQLError("Invalid password.")

			user.password = hashPassword(args.new_password)
			return "Password successfully updated."
		},
		deleteUser: async (parent, args, {User}) => {
			const _id = ObjectId.createFromHexString(args._id)
			const x = await User.findByIdAndRemove(_id).exec()
			return gqlUser(x)			
		}
	}
}