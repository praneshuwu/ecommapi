const Order = require('../models/Order');
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATE

router.post('/', async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500);
  }
});

//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json('Order Deleted Successfully');
  } catch (err) {
    res.status(500);
  }
});

//GET USER Order
router.get('/find/:id', verifyTokenAndAuth, async (req, res) => {
  try {
    const responseOrders = await Order.find({ userId: req.params.userId });

    return res.status(200).json(responseOrders);
  } catch (err) {
    return res.status(500);
  }
});

//GET ALL Orders
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Orders);
  } catch (err) {
    res.status(500);
  }
});

//GET MONTHLY INCOME

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.productId;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousMonth,
          },
          ...(productId && {
            products: {
              $elemMatch: { productId },
            },
          }),
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
