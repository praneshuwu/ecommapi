const Cart = require('../models/Cart');
const { verifyTokenAndAuth } = require('./verifyToken');

const router = require('express').Router();

//CREATE

router.post('/', async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500);
  }
});

//UPDATE
router.put('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedCart);
  } catch (err) {
    return res.status(500);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json('Cart Deleted Successfully');
  } catch (err) {
    res.status(500);
  }
});

//GET USER CART
router.get('/find/:id',verifyTokenAndAuth , async (req, res) => {
  try {
    const responseCart = await Cart.find({userId: req.params.userId});

    return res.status(200).json(responseCart);
  } catch (err) {
    return res.status(500);
  }
});

//GET ALL CART
router.get('/',verifyTokenAndAuth , async (req, res) => {
  try{

    const carts = await Cart.find();
    res.status(200).json(carts)

  }catch(err){
      res.status(500)
  }
});

module.exports = router;
