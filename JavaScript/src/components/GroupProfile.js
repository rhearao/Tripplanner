import React, { Component, useReducer } from "react";
import { connect } from "react-redux";
import { removeCurrentGroup } from "../store/selectedGroup";
import { getAllMembers, addMember, checkMember } from "../store/members";
import GroupNavbar from "./GroupNavbar";
import ReactModal from "react-modal";
import "../CSS/style.css";
import { withRouter } from "react-router-dom";
import { Button, Card, ThemeProvider } from "react-bootstrap";

class GroupProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: {},
      members: {},
      addMem: false,
      error: "",
      isLoading: true,
      showModal: false,
    };
    // this.handleClose = this.handleClose.bind(this);
    // this.handleAdd = this.handleAdd.bind(this);
  }

  componentWillReceiveProps({ members, selectedGroup, groups }) {
    if (members !== "{}") {
      this.setState({
        members: members,
        selectedGroup: selectedGroup,
        isLoading: false,
      });
      // console.log("print", members);
    }

    // console.log("in component will receive props", selectedGroup);
    // write new group info to local storage
    // localStorage.setItem("groups", JSON.stringify(groups));
  }

  handleAdd = () => {
    this.setState({
      // addMem: true,
      // isLoading: false,
      showModal: true,
    });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logoutGroup();
    this.props.history.push("/home/group");
  };

  handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const email = event.target.email.value;
      console.log("in handle submit the email is", this.props.selectedGroup.id);
      if (email)
        await this.props.checkMember(this.props.selectedGroup.id, email);
      this.setState({
        members: this.props.members,
      });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  render() {
    const { error } = this.props;
    // console.log("enter render", Object.entries(this.state.members));
    return this.state.isLoading ? (
      <div>Loading</div>
    ) : (
      <React.Fragment>
        <GroupNavbar />
        <h1 className="profile__title">
            Group #{this.props.selectedGroup.id} -
            {this.props.selectedGroup.groupName}
        </h1>
        <div className="member__info">
          {Object.entries(this.state.members).map((member) => {
            // console.log("the member", member);
            return (
              <div className="member__photo">
                <Card style={{ width: "18rem"}}>
                  <Card.Img style={{ width: "17rem", height: "17rem"}} variant="top" src={member[1].photoURLs} />

                  {/* <img src={memer[1].photoURLs} className="profile__img" /> */}
                  <Card.Title>Name</Card.Title>
                  <Card.Text>
                    <p className="member__card">
                      {member[1].firstName} {member[1].lastName}
                    </p>
                  </Card.Text>
                </Card>
              </div>
            );
          })}
        </div>
        <div>
          <ReactModal
            isOpen={this.state.showModal}
            // shouldCloseOnOverlayClick={true}
            // closeTimeoutMS={5000}
            contentLabel="Add new member Page"
            className="congrats__content"
            // overlayClassName="congrats__overlay"
            onRequestClose={() => console.log("Close handled")}
          >
            <i class="fas fa-spinner fa-spin fa-5x" />
            <br />
            <form
              className="login__form"
              name="login"
              onSubmit={this.handleSubmit}
            >
              <input
                className="login__input"
                name="email"
                type="text"
                placeholder="Email of the member you want to add"
              />
              <p> Note that the user has to sign up first </p>

              {this.props.error && error.response && (
                <div> {error.response.data} </div>
              )}
              <Button variant="primary" type="submit">
                Add this member
              </Button>
              <br></br>
              <Button
                className="login__button"
                type="submit"
                onClick={this.handleClose}
                variant="secondary"
              >
                Exit
              </Button>
            </form>
          </ReactModal>
        </div>
        <div className="group_profile__container">
          <Button onClick={this.handleAdd} block>
            Add a new Member
          </Button>

          <Button onClick={this.handleLogout} block>
            Change Group
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("enter mapStateToProps", state);
  return {
    error: state.user.error,
    selectedGroup: state.selectedGroup,
    members: { ...state.members },
    events: { ...state.events },
    user: state.user,
    groups: state.groups,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    addMember: (groupId, user) => dispatch(addMember(groupId, user)),
    getMembers: (groupId) => dispatch(getAllMembers(groupId)),
    logoutGroup: () => dispatch(removeCurrentGroup()),
    checkMember: (groupId, userEmail) =>
      dispatch(checkMember(groupId, userEmail)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GroupProfile)
);
