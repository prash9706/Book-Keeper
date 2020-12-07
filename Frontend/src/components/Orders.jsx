import React, { Component } from "react";
import { getOrders } from "../services/orderService";
import auth from "../services/authService";
import Table from "./common/table";
class Order extends Component {
  orderNum = 1;

  state = {
    orders: {},
    errors: {},
    user: {},
    isLoading: true,
  };

  columns = [
    { path: "title", label: "Title" },
    { path: "course", label: "Course" },
    { path: "author", label: "Author" },
    { path: "publication", label: "Publisher" },
    { path: "description", label: "Description" },
    { path: "dailyRentalRate", label: "Rent (per day)" },
    { path: "price", label: "Price" },
    { path: "qty", label: "Quantity" },
  ];

  populateOrders = async (userId) => {
    const data = await getOrders(userId);
    this.setState({ orders: data.data.Orders });
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user: user });
    await this.populateOrders(user._id);
  }

  render() {
    let flag =
      !this.state ||
      !this.state.orders ||
      !this.state.orders.length ||
      this.state.orders.length === 0;
    return (
      <div>
        {flag ? (
          <div>No Orders</div>
        ) : (
          <div>
            {this.state.orders.map((order) => (
              <div>
                <h5>Order #: {this.orderNum++}</h5>
                <Table columns={this.columns} data={order.books} />
                <br />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
export default Order;
