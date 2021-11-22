const User = require('../models/User');
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//UPDATE
router.put('/:id', verifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json('User Deleted Successfully');
  } catch (err) {
    res.status(500);
  }
});

//GET ONE USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const responseUser = await User.findById(req.params.id);

    const { password, ...others } = responseUser._doc;

    return res.status(200).json(others);
  } catch (err) {
    return res.status(500);
  }
});

//GET ALL USERS
router.get('/findall', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const responseUsers = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()
    return res.status(200).json(responseUsers);
  } catch (err) {
    res.status(300);
  }
});

//GET USER STATS

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
