import React, { Component, useReducer } from "react";
import { connect } from "react-redux";
import HomeNavbar from "./Homenavbar";
import "../CSS/style.css";
import { withRouter } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import { selectGroup } from "../store";
import { getAllMembers } from "../store/members";
import { getAllEvents} from "../store/event";

class UserGroup extends Component {
  constructor(props) {
    super(props);
    var isloading = true;
    if (props.groups !== "{}") {
      console.log("in constructor", props.groups);
      isloading = false;
    }
    this.state = {
      groups: props.groups,
      selectedGroup: {},
      isLoading: isloading,
    };
  }

  componentWillReceiveProps({ groups, selectedGroup }) {
    if (groups !== "{}") {
      this.setState({
        groups: groups,
        selectedGroup: selectedGroup,
        isLoading: false,
      });
      console.log("print groups", groups);
    }
  }

  handleSelect = (event) => {
    event.preventDefault();
    // in order to get the input tag, it needs to be target[0]
    this.props.select(event.target[0].value);
    // get all the members of the same group to the store
    this.props.getAllMembers(event.target[0].value);
    this.props.getAllEvents(event.target[0].value);
    this.props.history.push(`/group/${event.target[0].value}`);
  };

  render() {
    console.log("print gps", this.state.groups);
    return this.state.isLoading ? (
      <div>Loading</div>
    ) : (
      <React.Fragment>
        <HomeNavbar />
        <div>
          <CreateGroup />
        </div>

        <div className="home_group">
        <h1 className="group__title">Here are all the groups you belong to:</h1>
          <div className="group__info">

          {Object.entries(this.state.groups).map((group) => {
            console.log("every group ", group);
            return (
              <div className="group__details">
                {/* <h1 className="profile__title">Details</h1>
                <p className="profile__text">
                  Keep your information up-to-date.
                </p> */}
                <div className="profile__container">
                  <form className="profile__list" onSubmit={this.handleSelect}>
                    <label>Group Id</label>
                    <input
                      className="profile__input"
                      type="text"
                      name="id"
                      value={group[1].id}
                    />
                    <label>Group Location</label>
                    <input
                      className="profile__input"
                      value={group[1].locationName}
                    ></input>
                    <label>Group Name</label>
                    <input
                      className="profile__input"
                      value={group[1].name}
                    ></input>

                    <button className="profile__submit" type="submit">
                      Select
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    groups: { ...state.groups },
    selectedGroup: state.selectedGroup,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    select: (groupId) => dispatch(selectGroup(groupId)),
    getAllMembers: (groupId) => dispatch(getAllMembers(groupId)),
    getAllEvents: (groupId) => dispatch(getAllEvents(groupId))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserGroup);
