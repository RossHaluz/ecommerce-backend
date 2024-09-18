const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");

const { SECRET_KEY } = process.env;

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || "";

  if(!token){
    next(HttpError(401, "Unouthorized"))
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      next(HttpError(401, "Unothorized"));
    }

    req.userId = decoded;

    next()
  });
};


module.exports = {
    checkAuth
}