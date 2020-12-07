const mongoose = require('mongoose');

const Cart = mongoose.model('Cart', new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true, 
    minlength: 5,
    maxlength: 255
  },
  books: [{
    bookId: {
      type: String,
      required: true,
      trim: true, 
      minlength: 5,
      maxlength: 255
    },
    title: {
      type: String,
      required: true,
      trim: true, 
      minlength: 5,
      maxlength: 255
    },
    course: { 
      type: String,  
      required: true
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
    },
    qty:{
      type: Number, 
      required: true,
      min: 0,
      max: 255
    }
  } 
  ]
}));

exports.Cart = Cart; 