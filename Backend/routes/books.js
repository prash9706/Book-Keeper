const { Book, validate } = require("../models/book");
const { Course } = require("../models/course");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const moment = require("moment");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const books = await Book.find()
    .select("-__v")
    .sort("name");
  res.send(books);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send("Invalid course.");
console.log(req.body.imageId);
  const book = new Book({
    title: req.body.title,
    course: {
      _id: course._id,
      name: course.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    price: req.body.price,
    author: req.body.author,
    publication: req.body.publication,
    description: req.body.description,
    imageId: req.body.imageId.split("\\")[2],
    publishDate: moment().toJSON()
  });
  await book.save();

  res.send(book);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send("Invalid course.");

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      course: {
        _id: course._id,
        name: course.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      price: req.body.price,
      author: req.body.author,
      publication: req.body.publication,
      description: req.body.description,
      imageId: req.body.imageId
    },
    { new: true }
  );

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const book = await Book.findById(req.params.id).select("-__v");

  if (!book)
    return res.status(404).send("The book with the given ID was not found.");

  res.send(book);
});

module.exports = router;
