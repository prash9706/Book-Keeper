const { Course } = require("./models/course");
const { Book } = require("./models/book");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Artificial Intelligence",
  },
  {
    name: "Machine Learning",
  },
  {
    name: "Data Science & Analytics",
  },
  {
    name: "Robotics",
  },
  {
    name: "Software Engineering",
  },
  {
    name: "Human-Computer Interaction",
  },
  {
    name: "Cyber Security",
  },
  {
    name: "Data Structure and algorithm",
  },
  {
    name: "Web Programming Language",
  },
  {
    name: "Distributed systems",
  },
];

async function seed() {
  await mongoose.connect(config.get("db"), {useUnifiedTopology: true, useNewUrlParser: true });

  await Book.deleteMany({});
  await Course.deleteMany({});

  for (let course of data) {
    const { _id: courseId } = await new Course({ name: course.name }).save();
    // const books = course.books.map((book) => ({
    //   ...book,
    //   course: { _id: courseId, name: course.name },
    // }));
    // await Book.insertMany(books);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
