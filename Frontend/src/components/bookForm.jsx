import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getBook, saveBook } from "../services/bookService";
import { getCourses } from "../services/courseService";

class BookForm extends Form {
  state = {
    data: {
      title: "",
      courseId: "",
      numberInStock: "",
      price: "",
      dailyRentalRate: "",
      author : "",
      publication : "",
      description : "",
      imageId : ""
    },
    courses: [],
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    courseId: Joi.string()
      .required()
      .label("Course"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
    price: Joi.number()
      .required()
      .min(0)
      .max(500)
      .label("Price"),
    author: Joi.string()
      .required()
      .min(5)
      .max(50)
      .label("Author"),
    publication: Joi.string()
      .required()
      .min(5)
      .max(100)
      .label("Publication"),
    description: Joi.string()
      .required()
      .min(0)
      .max(500)
      .label("Description"),
    imageId: Joi.string()
      .required()
      .label("Image")
  };

  async populateCourses() {
    const { data: courses } = await getCourses();
    this.setState({ courses });
  }

  async populateBooks() {
    try {
      const bookId = this.props.match.params.id;
      if (bookId === "new") return;
      const { data: book } = await getBook(bookId);
      this.setState({ data: this.mapToViewModel(book) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    this.goBack = this.goBack.bind(this);
    await this.populateCourses();
    await this.populateBooks();
  }

  mapToViewModel(book) {
    return {
      _id: book._id,
      title: book.title,
      courseId: book.course._id,
      numberInStock: book.numberInStock,
      dailyRentalRate: book.dailyRentalRate,
      price: book.price,
      author: book.author,
      publication: book.publication,
      description: book.description,
      imageId: book.imageId
    };
  }

  doSubmit = async (e) => {
    await saveBook(this.state.data);
    this.props.history.push("/books");
  };

  goBack(){
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="col-md-6">
        <h1>Book Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("courseId", "Course", this.state.courses)}
          {this.renderInput("numberInStock", "Number in Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rental Charges(per day)")}
          {this.renderInput("price", "Price")}
          {this.renderInput("author", "Author")}
          {this.renderInput("publication", "Publication")}
          {this.renderTextArea("description", "Description")}
          {this.renderFile("imageId", "Upload Image")}
          {this.renderButton("Save")}
          <botton id="cancel" name="cancel" className="btn btn-primary mx-2" onClick={this.goBack}>Back</botton>
        </form>
      </div>
    );
  }
}

export default BookForm;
