const router = require('express').Router();
const stripe = require('stripe')(
  'sk_test_51JvJNiSGhjPEVbNlteZFP15sYu9jLC2ggwnK10x9ewSw2kRXVQeAEGz1vQdwGxxWUUcjMf6Tm7seXTSGXJT3TcXK00YQg1Q3zG'
);

router.post('/payments', (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'inr',
      description: 'A purchase',
      
    },
    (stripeErr, stripeRes) => {
      if (!stripeErr) {
        res.status(200).json(stripeRes);
      } else {
        res.status(300).json(stripeErr);
      }
    }
  );
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: 'usd',
  //         product_data: {
  //           name: 'T-shirt',
  //         },
  //         unit_amount: 2000,
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   mode: 'payment',
  //   success_url: 'https://localhost:3000/',
  //   cancel_url: 'https://localhost:3000/',
  // });

  // res.redirect(303, session.url);
});

module.exports = router;
