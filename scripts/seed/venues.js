function clear(){
	console.log(`Clearing venues collection.`)
}

function seeder(n, clearCollection=true){
	if(clearCollection){
		clear()
	}
	console.log(`Seeding ${n} venues.`)
}

export default seeder