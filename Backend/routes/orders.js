const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");

router.get("/:userId", async (req, res) => {
    const items = await Order.findOne({userId: req.params.userId}).select("-__v");
    res.send(items);
  });

  router.post("/placeOrder",  async (req, res) => {
    const items = await Order.findOne({userId: req.body.userId}).select("-__v");
    if (!items) {
        const {books: books} = req.body;
        const placedOrder = new Order({
            userId: req.body.userId,
            Orders: {
              books: books
            }
         });
        await placedOrder.save();
        return res.send(placedOrder);
    }else{
        items.Orders.push({books: req.body.books});
        const updatedItem = await Order.findByIdAndUpdate(
          items._id,
          {
            userId: items.userId,
            Orders: items.Orders
          }
        );
        res.send(updatedItem);
    }
  });

  module.exports = router;