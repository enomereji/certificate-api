const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

const routes = require("./routes/certificateRoutes")

dotenv.config();

const connectToDB = async ()=>{
    await mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(()=>{
        console.log("MongoDB Connected...")
    })
}

connectToDB()

const app = express();


app.use(cors()); 
app.use(express.json()); 

const certificateRoutes = require("./routes/certificateRoutes");

app.use("/api", certificateRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
