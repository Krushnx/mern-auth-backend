const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 8000;
const app = express();
const cookieParser = require("cookie-parser")
const cors  =require("cors")
dotenv.config();

mongoose.connect(process.env.DB);


const db = mongoose.connection;
db.on('error' , (error)=>{console.log(error);});

db.once('open' , ()=>{console.log("Conneced to MongoDB Atlas Successfully");});
app.use(express.json());
app.use(cookieParser());
app.use(cors());
//set up route

app.use("/auth" , require('./routes/userRoutes'));
app.use('/customer' , require('./routes/customerRoutes'))

app.listen(PORT, ()=>{
    console.log(`App listed on port http://localhost:8000`);
});


