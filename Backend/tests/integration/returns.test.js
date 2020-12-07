const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../models/rental');
const {Book} = require('../../models/book');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let server; 
  let customerId; 
  let bookId;
  let rental;
  let book; 
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, bookId });
  };
  
  beforeEach(async () => { 
    server = require('../../index'); 

    customerId = mongoose.Types.ObjectId();
    bookId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    book = new Book({
      _id: bookId,
      title: '12345',
      dailyRentalRate: 2,
      course: { name: '12345' },
      numberInStock: 10 
    });
    await book.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      book: {
        _id: bookId,
        title: '12345',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });

  afterEach(async () => { 
    await server.close(); 
    await Rental.remove({});
    await Book.remove({});
  });  

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = ''; 
    
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if bookId is not provided', async () => {
    bookId = ''; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found for the customer/book', async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if we have a valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the returnDate if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it('should set the rentalFee if input is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('should increase the book stock if input is valid', async () => {
    const res = await exec();

    const bookInDb = await Book.findById(bookId);
    expect(bookInDb.numberInStock).toBe(book.numberInStock + 1);
  });

  it('should return the rental if input is valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
      'customer', 'book']));
  });
});