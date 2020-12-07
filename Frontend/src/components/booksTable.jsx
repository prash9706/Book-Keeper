import React, { Component } from "react";

import auth from "../services/authService";
import Table from "./common/table";
import Like from "./common/like";

import { Link } from "react-router-dom";

class BooksTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: (book) => (
        <Link to={`/book/${book._id}`}>{book.title}</Link>
      ),
    },
    { path: "course.name", label: "Course" },
    { path: "dailyRentalRate", label: "Rent (per day)" },
    { path: "price", label: "Price" },
  ];

  stockColumn = {
    path: "numberInStock", label: "Stock"
  };

  likeColumn = {
    key: "like",
      content: (book) => (
        <Like liked={book.liked} onClick={() => this.props.onLike(book)} />
      ),
  };

  deleteColumn = {
    key: "delete",
    content: (book) => (
      <button
        onClick={() => this.props.onDelete(book)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) {
      this.columns.push(this.stockColumn);
      this.columns.push(this.deleteColumn);
    }else{
      this.columns.push(this.likeColumn);
    }
  }

  render() {
    const { books, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={books}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default BooksTable;
