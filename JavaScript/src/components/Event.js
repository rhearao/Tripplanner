import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllEvents, removeEvent } from "../store/event";
import GroupNavbar from "./GroupNavbar";
import CreateEvent from "./CreateEvent";
import "../CSS/style.css";
import { withRouter } from "react-router-dom";

class Event extends Component {
  constructor(props) {
    super(props);
    var isloading = true;
    if (props.events !== "{}") {
      console.log("in event constructor", props.events);
      isloading = false;
    }
    this.state = {
      events: props.events,
      error: "",
      selectedGroup: {},
      isloading: isloading,
    };
  }

  async componentDidMount() {
    await this.props.getAllEvents(this.props.match.params.groupId);
    if (this.props.events != null) {
      this.setState({
        events: this.props.events,
        selectedGroup: this.props.selectedGroup,
      });
    } else {
      this.setState({
        error: "There aren't any events.",
      });
    }
  }

  componentWillReceiveProps = async ({ events, selectedGroup }) => {
    // await this.props.getAllEvents(this.props.match.params.productId);
    // this.setState({
    //   events: events,
    //   selectedGroup: selectedGroup,
    // });

    if (events !== "{}") {
      this.setState({
        events: events,
        selectedGroup: selectedGroup,
        isLoading: false,
      });
      // console.log("print groups", groups);
    }
  };

  refresh = () => {
    this.setState({ update: 1 });
  };

  handleDelete = async (groupId, eventId) => {
    // console.log(
    //   "handle delete",
    //   this.state.events.filter((event) => event.id === eventId)
    // );
    // await this.props.removeEvent(groupId, eventId);
    await this.props.removeEvent(groupId, eventId);
    this.setState({
      events: this.state.events
    });
  };

  render() {
    return (
      <React.Fragment>
        <GroupNavbar />
        <CreateEvent refresh={() => this.refresh()} />
        {/* <CreateEvent /> */}

          <h1 className="group__title">
            Current Events:
          </h1>
          <div className="member__info">
          {Object.entries(this.state.events).map((event) => {
            return (
              <div className="event__details">
                <div className="profile__container">
                <p className="profile__text">name: {event[1].name}</p>
                <p className="profile__text">location: {event[1].location}</p>
                <p className="profile__text">details: {event[1].detail}</p>
                <button
                  onClick={() =>
                    this.handleDelete(this.props.selectedGroup.id, event[1].id)
                  }
                >
                  Remove this event
                </button>
              </div></div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.user.error,
    selectedGroup: state.selectedGroup,
    events: state.events,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    getAllEvents: (groupId) => dispatch(getAllEvents(groupId)),
    removeEvent: (groupId, eventId) => dispatch(removeEvent(groupId, eventId)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Event));
