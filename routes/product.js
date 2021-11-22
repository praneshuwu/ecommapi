const Product = require('../models/Product');
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATE

router.post('/create', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500);
  }
});

//UPDATE
router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json('User Deleted Successfully');
  } catch (err) {
    res.status(500);
  }
});

//GET ONE USER
router.get('/find/:id', async (req, res) => {
  try {
    const responseProduct = await Product.findById(req.params.id);

    return res.status(200).json(responseProduct);
  } catch (err) {
    return res.status(500);
  }
});

//GET ALL USERS
router.get('/', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    return res.status(200).json(products);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
