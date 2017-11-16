import {User} from '../../src/models'

const users = [
	{
		"name": "Juza",
		"student_id": "12345678",
		"password": "password"
	},
	{
		"name": "Morris",
		"student_id": "12345679",
		"password": "password"
	},
	{
		"name": "Mika",
		"student_id": "12345670",
		"password": "password"
	},
	{
		"name": "Louis",
		"student_id": "12345671",
		"password": "password"
	},
	{
		"name": "Mira",
		"student_id": "12345672",
		"password": "password"
	},
]
async function seeder(){
	await User.remove()
	users.forEach(async(user) => await new User(user).save())
}

export default seeder