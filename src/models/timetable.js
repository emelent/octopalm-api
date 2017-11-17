import mongoose from 'mongoose'

const {ObjectId} = mongoose.Schema.Types

const schema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	events: {
		type: [ObjectId]
	},
	modules: {
		type: [ObjectId]
	},
	author_id: {
		type: ObjectId,
		required: true
	}
})
export default mongoose.model('Timetable', schema)