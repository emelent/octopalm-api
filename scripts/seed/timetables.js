function clear(){
	console.log(`Clearing timetables collection.`)
}

function seeder(n, clearCollection=true){
	if(clearCollection){
		clear()
	}
	console.log(`Seeding ${n} timetables.`)
}

export default seeder