import {Module} from '../../src/models'

function clear(){
	console.log(`Clearing modules collection.`)
	Module.remove()
}

function seeder(n, clearCollection=true){
	if(clearCollection){
		clear()
	}
	console.log(`Seeding ${n} modules.`)
}

export default seeder