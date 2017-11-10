const {
	GraphQLError
} = require('graphql')
const ObjectId = require('mongoose').Types.ObjectId
const {validateToken, inflateId, isHex, hashPassword} = require('./utils')


//=========================
// Transformer Functions
//
// These functions transform the given model to the form required
// by the graphql schema created. This is mostly transforming
// ObjectId types to strings.
//=========================
const gqlEvent = x => {
	if (!x) return
	x._id = x._id.toString()
	if (x.module_id)
		x.module_id = x.module_id.toString()
	if (x.date)
		x.date = x.date.toString()
	if (x.author_id)
		x.author_id = x.author_id.toString()
	if (x.venue)
		x.venue = x.venue.toString()

	return x
}
const gqlModule = x => {
	if (!x) return
	x._id = x._id.toString()
	return x
}

const gqlUser = x => {
	if (!x) return
	x._id = x._id.toString()
	x.modules = x.modules.map(y => y.toString())
	x.timetables = x.timetables.map(y => y.toString())
	x.timetable_aliases = x.timetable_aliases.map(y => ({
		timetable_id: y.timetable_id.toString(),
		alias: y.alias
	}))
	if (x.active_timetable)
		x.active_timetable = x.active_timetable.toString()
	
	return x
}

const gqlTimetable = x => {
	if (!x) return
	x._id = x._id.toString()
	x.author_id = x.author_id.toString()
	if (x.events)
		x.events = x.events.map(y => y.toString())
	if (x.modules)
		x.modules = x.modules.map(y => y.toString())
	return x
}

const gqlVenue = x => {
	if(!x) return
	x._id = x._id.toString()
	return x
}


module.exports = {
	Query: {
		//=======================
		// VENUE QUERIES
		//=======================

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

		
		//=======================
		// MODULE QUERIES
		//=======================

		modules: async(parent, args, {Module}) => {
			const modules = await Module.find(args).exec()
			return modules.map(x => gqlModule(x))
		},
		module: async(parent, args, {
			Module
		}) => {
			const x = await Module.findOne(args).exec()
			return gqlModule(x)
		},


		//=======================
		// EVENT QUERIES
		//=======================

		events: async(parent, args, {
			Event
		}) => {
			if(args.venue && isHex(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const events = await Event.find(args).exec()
			return events.map(x => gqlEvent(x))
		},
		event: async(parent, args, {
			Event
		}) => {
			const x = await Event.findById(inflateId(args._id)).exec()
			return gqlEvent(x)
		},


		//=======================
		// USER QUERIES
		//=======================
		user: async(parent, args, {
			User
		}) => {
			const x = await User.findOne(args).exec()
			return gqlUser(x)
		},
		users: async(parent, args, {
			User
		}) => {
			const users = await User.find().exec()
			return users.map(x => gqlUser(x))
		},


		//=======================
		// TIMETABLE QUERIES
		//=======================
		timetablesByModules: async(parent, args, {
			Timetable
		}) => {
			const modules = args.modules.map(x => inflateId(x))
			let timetables = []
			if(args.strict){
				timetables = await Timetable.find()
					.where('modules').size(modules.length).exec()
			}else{
				timetables = await Timetable.find()
					.where('modules').in(modules).exec()
			}
			return timetables.map(x => gqlTimetable(x))
		},
		timetablesByAuthor: async(parent, args, {
			Timetable
		}) => {
			const timetables = await Timetable.find({
				author_id: inflateId(args.author_id)
			}).exec()
			return timetables.map(x => gqlTimetable(x))
		},

		timetables: async(parent, args, {
			Timetable
		}) => {
			const timetables = await Timetable.find().exec()
			return timetables.map(x => gqlTimetable(x))
		}

	},
	Mutation: {

		//=======================
		// VENUE MUTATIONS
		//=======================
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

		//=======================
		// MODULE MUTATIONS
		//=======================
		createModule: async(parent, args, {
			Module
		}) => {
			const x = await new Module(args).save()
			return gqlModule(x)
		},
		updateModule: async(parent, args, {
			Module
		}) => {
			const _id = ObjectId.createFromHexString(args._id)
			delete args._id
			const x = await Module.findByIdAndUpdate(_id, args).exec()
			return gqlModule(x)
		},
		deleteModule: async(parent, args, {
			Module
		}) => {
			const _id = ObjectId.createFromHexString(args._id)
			const x = await Module.findByIdAndRemove(_id).exec()
			return gqlModule(x)
		},

		//=======================
		// EVENT MUTATIONS
		//=======================
		createEvent: async(parent, args, {
			Event
		}) => {
			if(args.venue && isHex(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const x = await new Event(args).save()
			return gqlEvent(x)
		},
		updateEvent: async(parent, args, {
			Event
		}) => {
			if(args.venue && isHex(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const _id = ObjectId.createFromHexString(args._id)
			delete args._id
			const x = await Event.findByIdAndUpdate(_id, args).exec()
			return gqlEvent(x)
		},
		deleteEvent: async(parent, args, {
			Event
		}) => {
			const _id = ObjectId.createFromHexString(args._id)
			const x = await Event.findByIdAndRemove(_id).exec()
			return gqlEvent(x)
		},

		//=======================
		// TIMETABLE MUTATIONS
		//=======================
		createTimetable: async(parent, args, {
			Timetable
		}) => {
			//TODO use a real user id from  token
			const data = { ...args,
				author_id: ObjectId().toString()
			}
			const x = await new Timetable(data).save()
			return gqlTimetable(x)
		},
		updateTimetable: async(parent, args, {
			Timetable,
			Event
		}) => {
			const timetable = await Timetable.findById(inflateId(args._id)).exec()

			if (args.events) {
				//update events ObjectId array 
				timetable.events = args.events.map(x => ObjectId.createFromHexString(x))

				const setToArray = (s) => {
					const arr = []
					s.forEach(v => arr.push(v))
					return arr
				}

				//get actual events that match given id's
				const ids = args.events.map(x => inflateId(x))
				const events = await Event.find().where('_id').in(ids).exec()

				const modules = events.filter(x => {
					const id = x._id.toString()
					return args.events.indexOf(id) > -1 && x.module_id
				}).map(x => x.module_id.toString())

				//redo this with reducer
				const moduleSet = new Set(modules)
				timetable.modules = setToArray(moduleSet).map(x => inflateId(x))
			}
			if (args.alias) {
				//update user's alias for timetable
			}

			return timetable.save().then(x => gqlTimetable(x))
		},

		//=======================
		// USER MUTATIONS
		//=======================
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
	},
};