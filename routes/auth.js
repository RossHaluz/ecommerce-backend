const { userRegister, userLogin, userLogout, userCurrent, updateUser, changePassword } = require('../controllers/auth');
const { validateBody, checkAuth } = require('../middelwars');
const upload = require('../middelwars/upload');
const { schemaUserRegister, schemaUserLogin } = require('../modules/User');

const route = require('express').Router();

//Register user
route.post('/register', validateBody(schemaUserRegister), userRegister);

//Login user
route.post('/login', validateBody(schemaUserLogin), userLogin);

//Logout user
route.post('/logout', checkAuth, userLogout);

//Current user 
route.get('/current', checkAuth, userCurrent);

//Update user 
route.patch('/update', checkAuth, upload.single("avatar"), updateUser);

//Change password
route.post('/change-password', checkAuth, changePassword);

module.exports = route