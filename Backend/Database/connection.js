const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Pdf', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connection succeeded");
    } catch (err) {
        console.error("Connection failed", err);
    }
}

connectToDatabase();
