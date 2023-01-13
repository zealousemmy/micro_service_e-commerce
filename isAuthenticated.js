const jwt = require("jsonwebtoken");

// creating a middleware of isAuthenticated
// as a middle ware is expects three params
export async function isAuthenicated(req, res, next) {
  // the request is expected to be "Bearer <token>" which is a long string
  // what we need to do is "Bearer <token>".split("")[1]; index one to be able to get the token
  const token = req.headers["authorization"].split("")[1];
  // verifying the token
  jwt.verify(token, "secret", (err, user) => {
    if (err) {
      return res.json({ message: err });
    } else {
      req.user = user;
      next();
    }
  });
}
