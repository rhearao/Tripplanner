import React, { Component } from "react";
import { connect } from "react-redux";
import { removeCurrentGroup } from "../store/selectedGroup";
import { Navbar, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "../CSS/style.css";

class GroupNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTap: this.props.currentTap,
    };
  }

  handleClick = (event) => {
    if (event.target.name !== this.props) {
      this.props.history.push(
        `/group/${this.props.selectedGroup.id}/${event.target.name}`
      );
    }
    //Update state
    this.setState({
      currentTap: event.target.name,
    });
  };

  handleLogout = () => {
    // this.props.logout();
    this.props.history.push(`/group/${this.props.selectedGroup.id}`);
  };
  handleProfile = () => {
    this.props.history.push(`/group/${this.props.selectedGroup.id}`);
  };
  handleHome = () => {
    this.props.history.push(`/home/group`);
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
              <Nav.Link type="submit" name="group" onClick={this.handleProfile}>
                Profile
              </Nav.Link>
              <Nav.Link name="map" onClick={this.handleClick}>
                Map
              </Nav.Link>
              <Nav.Link name="event" onClick={this.handleClick}>
                Event
              </Nav.Link>
              <Nav.Link onClick={this.handleHome}>Home</Nav.Link>
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
    selectedGroup: state.selectedGroup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(removeCurrentGroup()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GroupNavbar)
);
