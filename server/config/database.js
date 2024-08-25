const mongoose = require('mongoose')
require("dotenv").config()
exports.db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlparser: true,
            useUnifiedTopology: true,
        })
        console.log('connected to Database');
    }
    catch (error) {
        console.log(error);
    }
}