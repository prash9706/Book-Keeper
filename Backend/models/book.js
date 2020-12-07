const Joi = require('joi');
const mongoose = require('mongoose');
const {courseSchema} = require('./course');

const Book = mongoose.model('Books', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  course: { 
    type: courseSchema,  
    required: true
  },
  numberInStock: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  price: { 
    type: Number, 
    required: true,
    min: 0,
    max: 255
  },
  author: { 
    type: String, 
    required: true,
    min: 5,
    max: 255
  },
  publication: { 
    type: String, 
    required: true,
    min: 5,
    max: 255
  },
  description: { 
    type: String, 
    required: true,
    min: 10,
    max: 500
  },
  imageId: { 
    type: String, 
    required: true,
    min: 5,
    max: 255
  }
}));

function validateBook(book) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    courseId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    author: Joi.string().min(5).required(),
    publication: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
    imageId: Joi.string().required()
  };

  return Joi.validate(book, schema);
}

exports.Book = Book; 
exports.validate = validateBook;