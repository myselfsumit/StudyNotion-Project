//Import Mongoose Instance
const mongoose = require("mongoose");
require("dotenv").config();

exports.mongoose = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => {
        console.log(err);
        console.log("DB Connection Failed");
        process.exit(1);
    });
};