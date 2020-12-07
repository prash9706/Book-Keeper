import http from "./httpService";
import config from "../config.json";

export function getBooks() {
  return http.get(config.apiURL + "/books");
}

export function getBook(bookId) {
  return http.get(config.apiURL + "/books/" + bookId);
}

export function deleteBook(bookId) {
  http.delete(config.apiURL + "/books/" + bookId);
}

export function saveBook(book) {
  if (book._id) {
    const body = { ...book };
    delete body._id;
    return http.put(config.apiURL + "/books/" + book._id, body);
  }

  return http.post(config.apiURL + "/books", book);
}
