import http from "./httpService";
import config from "../config.json";

export function getCart(userId) {
    return http.get(config.apiURL + "/carts/" +userId );
}

export function addToCart(userId, book) {  
    const body = { 
        userId: userId,
        bookId: book._id,
        title: book.title,
        course: book.course.name,
        dailyRentalRate: book.dailyRentalRate,
        price: book.price,
        author: book.author,
        publication: book.publication,
        description: book.description,
        imageId: book.imageId
    };
    return http.post(config.apiURL + "/carts/addToCartQty", body);
}

export function removeFromCart(userId, book) {  
    const body = { 
        userId: userId,
        bookId: book._id,
        title: book.title,
        course: book.course.name,
        dailyRentalRate: book.dailyRentalRate,
        price: book.price,
        author: book.author,
        publication: book.publication,
        description: book.description,
        imageId: book.imageId
    };
    return http.post(config.apiURL + "/carts/removeFromCart", body);
}

export function deleteCart(userId) {  
    return http.delete(config.apiURL + "/carts/" + userId);
}