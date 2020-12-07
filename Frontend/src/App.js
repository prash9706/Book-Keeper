import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Books from "./components/books";
import BookDetail from "./components/bookDetail";
import BookForm from "./components/bookForm";
import Order from "./components/Orders";
import Cart from "./components/cart";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    // try {
    //   const jwt = localStorage.getItem("token");
    //   const user = jwtDecode(jwt);
    //   this.setState({ user });
    // } catch (ex) {} // moved to authServices

    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container-fluid">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/book/:id" component={BookDetail} />
            <Route path="/books/:id" component={BookForm} />
            <Route
              path="/books"
              render={(props) => <Books {...props} user={user} />}
            />
            <Route path="/order" component={Order} />
            <Route path="/cart" component={Cart} />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/books" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
