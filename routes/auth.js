const User = require('../models/User');

const router = require('express').Router();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
  //TODO: Form validation
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    res.status(500);
  }
});

//LOGIN

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json('Wrong Credentials');

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);


    const accessToken = jwt.sign(
      {
        auth: true,
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {
        expiresIn: '3d',
      }
    );

    originalPassword !== req.body.password &&
      res.status(401).json({auth: false, message:'Wrong Credentials'});

    const { password, ...others } = user._doc;

    return res.status(200).json({auth: true,user: {...others}, token: accessToken})
    
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
