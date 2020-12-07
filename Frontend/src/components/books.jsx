import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BooksTable from "./booksTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getBooks, deleteBook } from "../services/bookService";
import { getCourses } from "../services/courseService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";

class Books extends Component {
  state = {
    books: [],
    courses: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedCourse: null,
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    const { data } = await getCourses();
    const courses = [{ _id: "", name: "All Courses" }, ...data];

    const { data: books } = await getBooks();

    this.setState({ books, courses });
  }

  handleDelete = async (book) => {
    const originalBooks = this.state.books;
    const books = originalBooks.filter((m) => m._id !== book._id);
    this.setState({ books });

    try {
      await deleteBook(book._id);
      // console.log("delete");
    } catch (ex) {
      // console.log("ex");
      if (ex.response && ex.response.status === 404) {
        // console.log("error");
        toast.error("Already Deleted");
      }
      this.setState({ books: originalBooks });
    }
  };

  handleLike = (book) => {
    const books = [...this.state.books];
    const index = books.indexOf(book);
    books[index] = { ...books[index] };
    books[index].liked = !books[index].liked;
    this.setState({ books });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleCourseSelect = (course) => {
    this.setState({ selectedCourse: course, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedCourse: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedCourse,
      searchQuery,
      books: allBooks,
    } = this.state;

    let filtered = allBooks;
    if (searchQuery)
      filtered = allBooks.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCourse && selectedCourse._id)
      filtered = allBooks.filter((m) => m.course._id === selectedCourse._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const courses = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: courses };
  };

  render() {
    const { length: count } = this.state.books;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) {
      return (
      <div>
        <p>There are no book in the database.</p>
        {user && user.isAdmin && (
            <Link
              to="/books/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Book
            </Link>
          )}
      </div>);
    }

    const { totalCount, data: books } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-2">
          <ListGroup
            items={this.state.courses}
            selectedItem={this.state.selectedCourse}
            onItemSelect={this.handleCourseSelect}
          />
        </div>

        <div className="col-10">
          {user && user.isAdmin && (
            <Link
              to="/books/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Book
            </Link>
          )}

          <p>Showing {totalCount} books in the database.</p>

          <SearchBox value={searchQuery} onChange={this.handleSearch} />

          <BooksTable
            books={books}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />

          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Books;
