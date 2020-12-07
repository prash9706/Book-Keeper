const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Cart } = require("../models/cart");

router.get("/:userId", async (req, res) => {
  const items = await Cart.findOne({userId: req.params.userId}).select("-__v");
  res.send(items);
});

router.post("/addToCartQty",  async (req, res) => {
  const items = await Cart.findOne({userId: req.body.userId}).select("-__v");
  if (!items) {
      let books =[];
      let book = {};
      book.bookId = req.body.bookId;
      book.title = req.body.title;
      book.course = req.body.course;
      book.dailyRentalRate = req.body.dailyRentalRate;
      book.price = req.body.price;
      book.author = req.body.author;
      book.publication = req.body.publication;
      book.description = req.body.description;
      book.imageId = req.body.imageId;
      book.qty = 1;
      books.push(book);
      const cart = new Cart({
          userId: req.body.userId,
          books: books
       });
      await cart.save();
      return res.send(cart);
  }else{
        let books =items.books;
        let idx = -1;
        for(let i=0;i<books.length;i++){
            if(books[i].bookId===req.body.bookId){
                idx=i;
                break;
            }
        }
        if(idx==-1){
            let book = {};
            book.bookId = req.body.bookId;
            book.title = req.body.title;
            book.course = req.body.course;
            book.dailyRentalRate = req.body.dailyRentalRate;
            book.price = req.body.price;
            book.author = req.body.author;
            book.publication = req.body.publication;
            book.description = req.body.description;
            book.imageId = req.body.imageId;
            book.qty = 1;
            books.push(book);
        }else{
            books[idx].qty = books[idx].qty+1;
        }
      const updatedItem = await Cart.findByIdAndUpdate(
        items._id,
        {
          userId: items.userId,
          books: items.books
        }
      );
      res.send(updatedItem);
  }
});

router.post("/removeFromCartQty",  async (req, res) => {
    const items = await Cart.find({userId: req.body.userId}).select("-__v");
    if (!items) {
        res.send("No item to remove");
    }else{
        let books =items.books;
        let idx = -1;
        for(let i=0;i<books.length;i++){
            if(books[i].bookId==req.body.bookId){
                idx=i;
                break;
            }
        }
        if(idx==-1){
            return res.send("No item to remove");
        }
        let val = books[idx].qty;
        if(val==1){
            books.splice(idx, 1);
        }else{
            books[idx].qty = books[idx].qty-1;
        }
            const updatedItem = await Cart.findByIdAndUpdate(
            items._id,
            {
                userId: items.userId,
                books: items.books
            }
            );
            res.send(updatedItem);
        }
  });

  router.post("/removeFromCart",  async (req, res) => {
    const items = await Cart.findOne({userId: req.body.userId}).select("-__v");
    if (!items) {
        res.send("No item to remove");
    }else{
        let books =items.books;
        let idx = -1;
        for(let i=0;i<books.length;i++){
            if(books[i].bookId==req.body.bookId){
                idx=i;
                break;
            }
        }
        if(idx==-1){
            return res.send("No item to remove");
        }
        books.splice(idx, 1);
       const updatedItem = await Cart.findByIdAndUpdate(
        items._id,
        {
            userId: items.userId,
            books: items.books
        }
        );
        res.send(updatedItem);
    }
  });

  router.post("/removeFromCartQty",  async (req, res) => {
    const items = await Cart.find({userId: req.body.userId}).select("-__v");
    if (!items) {
        res.send("No item to remove");
    }else{
        let books =items.books;
        let idx = -1;
        for(let i=0;i<books.length;i++){
            if(books[i].bookId==req.body.bookId){
                idx=i;
                break;
            }
        }
        if(idx==-1){
            return res.send("No item to remove");
        }
        let val = books[idx].qty;
        if(val==1){
            books.splice(idx, 1);
        }else{
            books[idx].qty = books[idx].qty-1;
        }
            const updatedItem = await Cart.findByIdAndUpdate(
            items._id,
            {
                userId: items.userId,
                books: items.books
            }
            );
            res.send(updatedItem);
        }
  });

  router.delete("/:id",  async (req, res) => {
    if(!req.params.id){
        return res.status(404).send("The cart for this user was not found.");
    }
    const items = await Cart.findOne({userId: req.params.id}).select("-__v");
    const cart = await Cart.findByIdAndRemove(items._id);
    if (!cart)
      return res.status(404).send("The cart for this user was not found.");
  
    res.send(cart);
  });

  module.exports = router;