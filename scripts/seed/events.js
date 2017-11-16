import {Event, Venue, Module} from '../../src/models'
import {pickRandom} from '../../src/utils'

const events = [
	{
	"name": "L1",
	"language": "E",
	"day": "WEDNESDAY",
	"start": "13:30",
	"end": "14:20"
	}, {
	"name": "L2",
	"language": "E",
	"day": "THURSDAY",
	"start": "13:30",
	"end": "14:20",
}, {
	"name": "L3",
	"language": "E",
	"day": "FRIDAY",
	"start": "11:30",
	"end": "12:20",
}, {
	"name": "L3",
	"language": "E",
	"day": "FRIDAY",
	"start": "11:30",
	"end": "12:20",
}, {
	"name": "L1",
	"language": "E",
	"day": "MONDAY",
	"start": "11:30",
	"end": "12:20",
}, {
	"name": "L2",
	"language": "E",
	"day": "WEDNESDAY",
	"start": "15:30",
	"end": "16:20",
}]

async function seeder(){
	Event.remove()

	const modules = await Module.find()
	const venues = await Venue.find()
 
	events.forEach(async(event) => {
		event.venue = pickRandom(venues)._id
		event.module_id = pickRandom(modules)._id
		await new Event(event).save()
	})
}

export default seeder