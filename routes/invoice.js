const { responseInvoice } = require('../controllers/invoice');
const route = require('express').Router();

//Response invoice 
route.get('/response-invoice', responseInvoice);

module.exports = route;