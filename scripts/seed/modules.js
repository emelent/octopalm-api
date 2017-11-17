import {Module} from '../../src/models'

const modules = [{
	"code": "WTW 114",
	"lessons": 3,
	"name": "CALCULUS I",
	"period": "S1"
},
{
	"code": "COS 132",
	"lessons": 3,
	"name": "IMPERATIVE PROGRAMMING",
	"period": "S1"
},
{
	"code": "ALL 121",
	"lessons": 2,
	"name": "ACADEMIC LITERACY",
	"period": "S2"
}
]

async function seeder() {
	await Module.remove()
	modules.forEach(
		async(module) => await new Module(module).save()
	)
}

export default seeder