import React , { Component } from "react";
import { getBook } from "../services/bookService";
import {getCart, removeFromCart, addToCart} from "../services/cartService";
import auth from "../services/authService";
class BookDetail extends Component {
    state = {
        book: {
            title: "",
            course: {},
            numberInStock: "",
            price: "",
            dailyRentalRate: "",
            author : "",
            publication : "",
            description : "",
            imageId : ""
          },
        errors: {},
        user: {},
        isInCart: false
    };

    async populateBook() {
        try {
          const bookId = this.props.match.params.id;
          const data= await getBook(bookId);
          this.setState({ book: data.data });
        } catch (ex) {
          if (ex.response && ex.response.status === 404) {
            this.props.history.replace("/not-found");
          }
        }
    }

    async componentDidMount() {
        this.goBack = this.goBack.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.handleRemoveCart = this.handleRemoveCart.bind(this);
        await this.populateBook();
        const user = auth.getCurrentUser();
        this.setState({ user: user });
        if(user){
            const {data} = await getCart(user._id);
            if(data && data.books){
                for(let i=0;i<data.books.length; i++){
                    if(data.books[i].bookId===this.state.book._id){
                        this.setState({isInCart: true});
                        break;
                    }
                }
            }
        }
    }

    handleAddToCart(){
        addToCart(this.state.user._id, this.state.book);
        this.setState({isInCart: true});
    }

    handleRemoveCart(){
        removeFromCart(this.state.user._id, this.state.book);
        this.setState({isInCart: false});
    }

    goBack(){
        this.props.history.goBack();
    }

    render() {
        return (
            <div className="container">
                <h1>Book Detail</h1>
                <p><img src="/images/+{this.state.book.imageId}" alt=""/></p>
                <p>Title: {this.state.book.title}</p>
                <p>Course: {this.state.book.course.name}</p>
                <p>Description:{this.state.book.description}</p>
                <p>Author:{this.state.book.author}</p>
                <p>Publication:{this.state.book.publication}</p>
                <p>Price:{this.state.book.price}</p>
                <p>Rent:{this.state.book.dailyRentalRate}</p>
                { this.state.user && !this.state.user.isAdmin && !this.state.isInCart &&
                    <button className="btn btn-primary mx-2" onClick={this.handleAddToCart}>Add to Cart</button>
                }
                { this.state.user && !this.state.user.isAdmin && this.state.isInCart &&
                    <button  className="btn btn-primary mx-2" onClick={this.handleRemoveCart}>Remove from Cart</button>
                }
                 { this.state.user && this.state.user.isAdmin && 
                    <a className ="btn btn-warning" href={`/books/${this.state.book._id}`}>Edit video</a>
                 }
                <button className="btn btn-primary mx-2" onClick={this.goBack}>Back</button>
            </div>
        );
    }
}

export default BookDetail;