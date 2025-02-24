const mongoose = require('mongoose');

const db = async() => {
    try {
        await mongoose.connect(process.env.DB_LINK);
        console.log('Connected to MongoDB');
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = db;