const mongoose = require('mongoose');

// function to connect
const connectDB = async () => {
    console.log("log from connectDB");
    try {
        // connect to mongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB is successfully connected: ${conn.connection.host} 👍 😄`);
    } catch (err) {
        console.log(err, "MongoDB connection has errored out 👎 😢");
        process.exit(1);
    }
}

connectDB();