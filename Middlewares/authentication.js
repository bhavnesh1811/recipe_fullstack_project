const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, "bhavnesh", (err, decoded) => {
      if (decoded) {
        req.body.user = decoded.userID;
        next();
      } else {
        res.status(401).send({ msg: "Please Login First", error: err.message });
      }
    });
  } else {
    res.status(401).send({ msg: "Please Login First" });
  }
};

module.exports = { authentication };