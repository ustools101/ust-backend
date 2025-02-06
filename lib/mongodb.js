const { connect } = require("mongoose");

async function connectDB(){
    try{
        const MONGO_URI = process.env.MONGO_URI;
        await connect(MONGO_URI);
        console.log("MongoDB Connected...")
    }catch(error){
        console.log("Error connecting to database");
    }
}

connectDB();
