const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  const token = authHeader.split(' ')[1];
  if (token) {
    
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        res.status(403).json('Token invalid');
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json('You are not authorised to perform this operation');
  }
};

const verifyTokenAndAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id || req.user.isAdmin) {
      res.json(req.user);
      next();
    } else {
      res
        .status(403)
        .json({
          error:
            'VerifyTokenAndAuthError: You are not authorised to perform this operation'
        });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res
          .status(403)
          .json({
            error:
              'VerifyTokenAndAuthError: You are not authorised to perform this operation'
          });
      }
    });
  };

module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin };
