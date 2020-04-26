import React, { Component } from "react";
import GroupNavbar from "./GroupNavbar";
import "../CSS/style.css";
// import { createGroup } from "../store/user";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { creatNewGroup } from "../store/selectedGroup";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { getAllGroups } from "../store/group";
import { selectGroup } from "../store";
// import "react-google-places-autocomplete/dist/index.min.css";

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      lat: "",
      lng: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // for calendar date
  onDateChange = (date) => {
    if (date.length === 2)
      this.setState({ startDate: date[0], endDate: date[1] });
    console.log("selected date is ", date);
  };

  async handleSubmit(event) {
    // event.preventDefault();
    // console.log(this.props);
    // this.props.createGroup(this.props.groupName, this.props.location);
    event.preventDefault();
    console.log(this.state.location);
    await geocodeByAddress(this.state.location)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.setState({
          lat: lat,
          lng: lng,
        });
      });
    // this.props.select(event.value);
    console.log("The lat", this.state.lat);
    const gpID = await this.props.creatNewGroup(
      this.state.groupName,
      this.state.location,
      this.state.startDate.toString(),
      this.state.endDate.toString(),
      this.state.lat.toString(),
      this.state.lng.toString()
    );
    // console.log("the id is ", this.state.endDate.toString());

    // add new group info to the store
    // console.log("new handle submit", this.props.user.id);
    this.props.getAllGroups(this.props.user.id);
    // get selected group
    this.props.select(gpID);
    alert(`Your new group id is ${gpID}`);
    // this.props.history.push(`/group/${gpID}`);
  }

  // handle the change of input field
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(this.state);
  };

  render() {
    return (
      <div>
        {/* <GroupNavbar /> */}
        <div style={{ textAlign: "center", fontSize: 20 }}>
          Create New Group
        </div>
        <br></br>
        <div className="create_group">
          <form className="profile__list" onSubmit={this.handleSubmit}>
            <input
              className="profile__input"
              type="text"
              name="groupName"
              onChange={this.handleChange}
              value={this.state.groupName}
              placeholder="Group Name"
            />
            {/* <input
              className="profile__input"
              type="text"
              name="location"
              onChange={this.handleChange}
              value={this.state.lastName}
              placeholder="Location"
            /> */}
            {/* address auto complete */}
            <div className="profile__input" name="location">
              <GooglePlacesAutocomplete
                onSelect={({ description }) => {
                  this.setState({ location: description });
                }}
                placeholder="Location"
              />
            </div>

            <div className="profile__input">
              select a date range
              <Calendar
                onChange={this.onDateChange}
                value={this.state.date}
                selectRange
              />
            </div>

            <button className="profile__submit" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// redux store data injected to props
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    creatNewGroup: (groupName, location, startDate, endDate, lat, lng) =>
      dispatch(
        creatNewGroup(groupName, location, startDate, endDate, lat, lng)
      ),
    getAllGroups: (userID) => dispatch(getAllGroups(userID)),
    select: (groupId) => dispatch(selectGroup(groupId)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateGroup)
);

// export default CreateGroup;
