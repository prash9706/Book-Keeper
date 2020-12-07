const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Course, validate } = require("../models/course");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const courses = await Course.find()
    .select("-__v")
    .sort("name");
  res.send(courses);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let course = new Course({ name: req.body.name });
  course = await course.save();

  res.send(course);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  );

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id);

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const course = await Course.findById(req.params.id).select("-__v");

  if (!course)
    return res.status(404).send("The course with the given ID was not found.");

  res.send(course);
});

module.exports = router;
