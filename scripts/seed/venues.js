import {Venue} from '../../src/models'

const venues = [
	{
		"name": "IT 4-1"
	},
	{
		"name": "IT 4-2"
	},
	{
		"name": "IT 4-3"
	},
	{
		"name": "IT 4-4"
	},
	{
		"name": "IT 4-5"
	},
	{
		"name": "EMB 4-152"
	},
	{
		"name": "EMB 4-151"
	},
	{
		"name": "EMB 4-153"
	},
]

async function seeder(){
	await Venue.remove()
	venues.forEach(async(venue) => await new Venue(venue).save())
}

export default seeder