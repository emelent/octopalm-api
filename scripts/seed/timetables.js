import {Timetable, User, Event} from '../../src/models'
import {pickRandom, setToArray, inflateId} from '../../src/utils'
import {random} from 'faker'

const setToArray = (s) => {
	const arr = []
	s.forEach(v => arr.push(v))
	return arr
}

async function seeder(){
	Timetable.remove()

	const users = await User.find()
	const events = await Event.find()
	const numTables = 10
	

	for(let i=0; i < numTables; i++){
		const data = {
			author_id: pickRandom(users)._id,
			name: random.words(2)
		}
		const numEvents = Math.floor(Math.random() * (events.length/2))
		const blankEvents = Array.apply(null, {length: 5}).map((v, i) => i)
		let availableEvents = events.map(x => x)
		const selectedEvents = blankEvents.map(
			() => {
				const event = pickRandom(availableEvents)
				availableEvents = availableEvents.filter(
					e => e !== event 
				)
				return event._id
			})
	
		const modules = events.filter(x => {
			const id = x._id.toString()
			return args.events.indexOf(id) > -1 && x.module_id
		}).map(x => x.module_id.toString())

		const moduleSet = new Set(modules)
		data.modules = setToArray(moduleSet).map(inflateId)
		data.events = selectedEvents
		const timetable = await new Timetable(data).save()
	}
}

export default seeder