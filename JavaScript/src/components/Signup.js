import React, { Component } from "react";
import { connect } from "react-redux";
import { signup } from "../store";
import { Link, withRouter } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    // Check if two passwords are the same
    this.setState({});
    const password = event.target.password.value;
    const confrimPassword = event.target.confirmPassword.value;
    if (password !== confrimPassword) {
      this.setState({
        error: "The passwords don't match.",
      });
      return;
    }

    // Connect to store to post to back-end
    try {
      event.preventDefault();
      const userInfo = {
        email: event.target.email.value,
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        password: event.target.password.value,
      };
      // const formName = event.target.name;
      if (
        userInfo.email &&
        userInfo.firstName &&
        userInfo.lastName &&
        userInfo.password
      ) {
        await this.props.signup(userInfo);
      } else {
        this.setState({
          error: "All fields are required",
        });
      }
      if (this.props.user.id) {
        // this.props.initSocket();
        this.props.history.push("/home/profile");
      }
    } catch (error) {
      this.setState({
        error,
      });
    }
  }

  render() {
    const { error } = this.props;
    return (
      <div className="signup page">
        <h1 className="signup__title">Triplanner</h1>

        <h1 className="email__title">Enter Your Email</h1>
        {error && error.response && <div> {error.response.data} </div>}
        <form
          className="email__form"
          name="signup"
          onSubmit={this.handleSubmit}
        >
          <input
            required
            name="email"
            className="email__input"
            type="email"
            placeholder="Email"
          />

          <input
            name="firstName"
            className="email__input"
            type="text"
            placeholder="First Name"
          />

          <input
            name="lastName"
            className="email__input"
            type="text"
            placeholder="Last Name"
          />

          <input
            name="password"
            className="email__input"
            type="password"
            placeholder="Password"
          />

          <input
            name="confirmPassword"
            className="email__input"
            type="password"
            placeholder="Confirm Password"
          />

          <button className="email__button" type="submit">
            Submit
          </button>
        </form>

        <div className="email__footer">
          <p>
            Already have an account?
            <Link className="login__footer__link" to="/auth/login">
              Sign In.
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    error: state.user.error,
    user: state.user,
  };
};

const mapDispatch = (dispatch) => {
  return {
    signup: (userInfo) => dispatch(signup(userInfo)),
  };
};

export default withRouter(connect(mapState, mapDispatch)(Signup));
