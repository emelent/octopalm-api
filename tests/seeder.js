const seeder = require('mongoose-seed')
const {dbUrl} = require('./globals')


// Connect to MongoDB via Mongoose
seeder.connect(dbUrl, function() {

	// Load Mongoose models
	seeder.loadModels([
		'./models/venue',
		// './models/event',
	]);

	// Clear specified collections
	seeder.clearModels(['Venue'], function() {

		// Callback to populate DB once collections have been cleared
		seeder.populateModels(data, function() {
			//seeder.disconnect();
		});

	});
});

// Data array containing seed data - documents organized by Model
const data = [
	{
		'model': 'Venue',
		'documents': [
			{
				name: 'HB 4-2'
			},
			{
				name: 'IT 2-25'
			},
			{
				name: 'EMB 2-152'
			},
			{
				name: 'CENT 1'
			}
		]
	}
];