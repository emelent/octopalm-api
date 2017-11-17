import mongoose from 'mongoose'

const schema = new mongoose.Schema({
	period:{
		type: String,
		required: true,
		uppercase: true
	},
	lessons: {
		type: Number,
		required: true
	},
	name: {
		type:String,
		required: true,
		unique: true,
		uppercase: true
	},
	code: {
		type:String,
		required: true,
		unique: true,
		uppercase: true
	}
})
export default mongoose.model('Module', schema)
