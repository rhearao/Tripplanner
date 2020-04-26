import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../store/user";
import { Navbar, Nav } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import "../CSS/style.css";

class HomeNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTap: this.props.currentTap,
    };
  }

  handleClick = (event) => {
    // If click on a different tap, jump to that page
    console.log("event data", event.target.name);
    console.log("prop data", this.props);
    // seems like there is no data in props
    if (event.target.name !== this.props) {
      this.props.history.push(`/home/${event.target.name}`);
    }
    //Update state
    this.setState({
      currentTap: event.target.name,
    });
  };

  handleLogout = () => {
    this.props.logout();
    this.props.history.push("/auth/login");
  };

  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand
            href="/home/group"
            style={{ fontSize: 30, fontFamily: "Shadows Into Light" }}
          >
            Triplanner
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" style={{ fontSize: 15 }}>
              <Nav.Link type="submit" name="group" onClick={this.handleClick}>
                Groups
              </Nav.Link>
              <Nav.Link name="profile" onClick={this.handleClick}>
                My Profile
              </Nav.Link>
              <Nav.Link onClick={this.handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentTap: state.currentTap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeNavbar)
);
