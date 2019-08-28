const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true
})
	.then(db => console.log(`Conection to database is succesfuly`))
	.catch(err => console.log(err));