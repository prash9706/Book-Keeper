import http from "./httpService";
import config from "../config.json";

export function getOrders(userId) {
    return http.get(config.apiURL + "/orders/" +userId );
}

export function placeOrder(userId, books) {  
    const body = { 
        userId: userId,
        books: books
    };
    return http.post(config.apiURL + "/orders/placeOrder", body);
}