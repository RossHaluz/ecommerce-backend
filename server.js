const mongoose = require('mongoose');
const { app } = require('./app');

const {BD_URL, PORT} = process.env;

mongoose.connect(BD_URL).then((res) => {
    console.log('Database success connect');
    app.listen(PORT);
}).catch((error) => {
    console.log(error.message);
    process.exit(1)
})