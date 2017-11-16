function clear(){
	console.log(`Clearing events collection.`)
}

function seeder(n, clearCollection=true){
	if(clearCollection){
		clear()
	}
	console.log(`Seeding ${n} events.`)
}

export default seeder