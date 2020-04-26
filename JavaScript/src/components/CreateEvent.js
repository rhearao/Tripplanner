import React, { Component } from "react";
import GroupNavbar from "./GroupNavbar";
import "../CSS/style.css";
// import { createGroup } from "../store/user";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { addNewEvent, addEvent } from "../store/event";

// import "react-google-places-autocomplete/dist/index.min.css";

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: "",
      location: "",
      detail: "",
      startDate: new Date(),
      endDate: new Date(),
      lat: "",
      lng: "",
    };
    console.log("enter create event");
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // for calendar date
  onDateChange = (date) => {
    if (date.length === 2)
      this.setState({ startDate: date[0], endDate: date[1] });
  };

  handleSubmit = async (event) => {
    // event.preventDefault();
    // console.log(this.props);
    // this.props.createGroup(this.props.groupName, this.props.location);
    event.preventDefault();
    // this.props.select(event.value);
    console.log(this.props.selectedGroup);
    await geocodeByAddress(this.state.location)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.setState({
          lat: lat,
          lng: lng,
        });
      });

    await this.props.addNewEvent(
      // the selected group id
      this.props.selectedGroup.id,
      {
        eventName: this.state.eventName,
        location: this.state.location,
        detail: this.state.detail,
        startDate: this.state.startDate.toString(),
        endDate: this.state.endDate.toString(),
        lat: this.state.lat,
        lng: this.state.lng,
      }
    );
    // console.log("this events", this.state.event);
    this.props.refresh();
  };

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
          Create New Event in Group {this.props.selectedGroup.id}
        </div>
        <br></br>
        <div className="create_group">
          <form className="profile__list" onSubmit={this.handleSubmit}>
            <input
              className="profile__input"
              type="text"
              name="eventName"
              onChange={this.handleChange}
              value={this.state.eventName}
              placeholder="Event Name"
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
                onSelect={({ description }) =>
                  this.setState({ location: description })
                }
                placeholder="Location"
              />
            </div>
            <div className="profile__input">
              <textarea
                style={{ width: "100%" }}
                rows="5"
                name="detail"
                placeholder="Event details"
                onChange={this.handleChange}
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
    selectedGroup: state.selectedGroup,
    events: state.events,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    addNewEvent: (groupID, eventInfo) => dispatch(addEvent(groupID, eventInfo)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateEvent)
);

// export default CreateGroup;
