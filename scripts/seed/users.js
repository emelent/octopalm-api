function clear(){
	console.log(`Clearing users collection.`)
}

function seeder(n, clearCollection=true){
	if(clearCollection){
		clear()
	}
	console.log(`Seeding ${n} users.`)
}

export default seeder