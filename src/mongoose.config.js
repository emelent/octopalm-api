export default function(mongoose){
	//set mongoose to return standard Javascript Promises instead of Mongoose promises
	//so we can use await/async stuff.
	mongoose.Promise =  global.Promise
	console.log('DB_URL =>', process.env.DB_URL)
	// connect database
	mongoose.connect(process.env.DB_URL, {useMongoClient: true})
}