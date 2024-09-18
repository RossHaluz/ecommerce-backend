const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const path = require('path');

//Routes 
const authRoute = require('./routes/auth');
const invoiceRoute = require('./routes/invoice');

const app = express();

//Middelwars
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoute);
app.use('/api/invoice', invoiceRoute);

//Not found route
app.use((req, res) => {
  res.status(404).json({ message: "Not found..." });
});

//Server error
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({message})
});

module.exports = {
    app
}
