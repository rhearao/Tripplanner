import React, { Component } from "react";
import { connect } from "react-redux";
import { login, logout } from "../store/user";
import { Link, withRouter } from "react-router-dom";
import "../CSS/style.css";
import { getAllGroups } from "../store/group";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // componentDidUpdate() {
  //   if (this.props.user && this.props.user.id) {
  //     this.props.history.push("/home/group");
  //   }
  // }
  async handleSubmit(event) {
    try {
      event.preventDefault();
      // const formName = event.target.name;
      console.log("sddds", event.target.email.value);
      const email = event.target.email.value;
      const password = event.target.password.value;
      if (email && password) await this.props.login(email, password);
      console.log("the props ", this.props);
      if (this.props.user.id) {
        console.log("this props history ", this.props.history);
        // introduce getgroups
        console.log("get all groups");
        this.props.getAllGroups(this.props.user.id);
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
      <div>
        <div className="login page page2">
          <h1 className="login__title">Triplanner</h1>
          {/* show erroe message */}
          {error && error.response && <div> {error.response.data} </div>}
          <form
            className="login__form"
            name="login"
            onSubmit={this.handleSubmit}
          >
            <input
              className="login__input"
              name="email"
              type="text"
              placeholder="Email"
            />
            <input
              className="login__input"
              name="password"
              type="password"
              placeholder="Password"
            />
            <Link className="login__option" to="/forgotpw">
              Forgot password?
            </Link>
            <button className="login__button" type="submit">
              Log In
            </button>
          </form>
          {/* <div className="login__divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <form method="get" action="http://localhost:3001/auth/google">
          <button className="login__oauth" type="submit">
            <i className="login__oauth__logo fab fa-google" />
            <p className="login__oauth__text">Log In With Google</p>
          </button>
        </form> */}
          <div className="login__footer">
            <p>
              Don't have an account?
              <Link className="login__footer__link" to="/auth/signup">
                Sign Up.
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    error: state.user.error,
    user: state.user,
    // matched: state.match.didMatch.matched
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    login: (email, password) => dispatch(login(email, password)),
    getAllGroups: (id) => dispatch(getAllGroups(id)),
  };
};
export default withRouter(connect(mapState, mapDispatchToProps)(Login));
