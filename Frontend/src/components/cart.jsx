import React , { Component } from "react";
import {getCart, deleteCart} from "../services/cartService";
import {placeOrder} from "../services/orderService";
import auth from "../services/authService";
import Table from "./common/table";
import { toast } from "react-toastify";

class Cart extends Component {
    

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            errors: {},
            user: {},
            total: 0
        };
      }

    columns = [
        { path: "title",label: "Title" },
        { path: "course", label: "Course" },
        { path: "author", label: "Author" },
        { path: "publication", label: "Publisher" },
        { path: "description", label: "Description" },
        { path: "dailyRentalRate", label: "Rent (per day)" },
        { path: "price", label: "Price" },
        { path: "qty", label: "Quantity",
            content: (book)=>(
                <div>
                    <button type="button" className="btn btn-danger" onClick={()=>this.handleRemoveFromCart(book)}>-</button>
                    <div className="d-inline p-2">{book.qty}</div>
                    <button type="button" className="btn btn-success" onClick={()=>this.handleAddtoCart(book)}>+</button>
                </div>
            ),
        },
      ];

     populateItems = async (userId) => {
        const cartItems = await getCart(userId);
        this.setState({items: cartItems.data.books});
    }

    handleRemoveFromCart(book) {
        if(book.qty===0){
            return;
        }
        book.qty = book.qty - 1;
        this.updateTotal();
    }

    handleAddtoCart(book){
        book.qty = book.qty + 1;
        this.updateTotal();
    }

    updateTotal(){
        let total =0;
        if(this.state.items){
            this.state.items.forEach(item =>{
                total = total + (item.price * item.qty);
            });
            this.setState({total: total});
        }
    }

    async componentDidMount() {
        this.updateTotal = this.updateTotal.bind(this);
        this.populateItems = this.populateItems.bind(this);
        this.handleCheckOut = this.handleCheckOut.bind(this);
        const user = auth.getCurrentUser();
        this.setState({ user: user });
        await this.populateItems(user._id);
        this.updateTotal();
    }

    async handleCheckOut() {
        await placeOrder(this.state.user._id, this.state.items);
        await deleteCart(this.state.user._id);
        toast.success("Order placed");
        this.props.history.push("/");
    }

    render() {
        return (
        <div>
            {!this.state.items || this.state.items.length===0 ? <div>No items in Cart</div> :
            <div>
                <Table
                    columns={this.columns}
                    data={this.state.items}
                />
                <div className="float-right">Total Amount: ${this.state.total}</div><br/>
                <button className="btn btn-primary float-right" onClick={this.handleCheckOut}>Checkout</button>
            </div>
            }
        </div>);
    }
}

export default Cart;