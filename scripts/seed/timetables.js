import {Timetable, User, Event} from '../../src/models'
import {pickRandom, setToArray, inflateId} from '../../src/utils'
import {random} from 'faker'

async function seeder(){
	await Timetable.remove()

	const users = await User.find()
	const events = await Event.find()
	const numTables = 10
	

	for(let i=0; i < numTables; i++){
		const user = pickRandom(users)
		const data = {
			author_id: user._id,
			name: random.words(2)
		}
		const numEvents = Math.floor(Math.random() * (events.length/2))
		const blankEvents = Array.apply(null, {length: 5}).map((v, i) => i)
		let availableEvents = events.concat()
		const selectedEvents = blankEvents.map(
			() => {
				const event = pickRandom(availableEvents)
				availableEvents = availableEvents.filter(
					e => e !== event 
				)
				return event._id
			})
		const strEvents = selectedEvents.map(String)
		const modules = events.filter(x => {
			const id = x._id.toString()
			return strEvents.indexOf(id) > -1 && x.module_id
		}).map(x => x.module_id.toString())

		const moduleSet = new Set(modules)
		data.modules = setToArray(moduleSet).map(inflateId)
		data.events = selectedEvents
		const timetable = await new Timetable(data).save()

		// update the user's timetable related stuff
		user.timetables = user.timetables.concat(timetable._id)
		user.active_timetable = timetable._id
		user.modules = timetable.modules.concat()
		await user.save()
	}
}

export default seeder