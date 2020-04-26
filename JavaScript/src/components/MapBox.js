import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import ReactSwipe from "react-swipe";
import { connect } from "react-redux";
import { getAllEvents, setSelectedIdx } from "../store";
// import { setIconImg } from "../store/icon";
import "./mapstyles.css";
import GroupNavbar from "./GroupNavbar";

// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// }

const customStyles = {
  container: {
    overflow: "hidden",
    position: "relative",
    width: "100%",
    background: "none",
  },
  wrapper: {
    overflow: "hidden",
    position: "relative",
    background: "none",
  },
  child: {
    float: "left",
    width: "100%",
    height: "100%",
    position: "relative",
    transitionProperty: "transform",
    background: "none",
    color: "black",
    border: "none",
    outline: "none",
  },
};

export class MapBox extends Component {
  constructor(props) {
    super(props);
    console.log("enter map box");
    this.state = {
      viewport: {
        width: "100%",
        height: "90vh",
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 14,
      },
      lat: 40.7128,
      long: -74.006,
      allEvents: {},
      user: null,
      loadedEvents: false,
      loadedMapLoc: false,
      selectedGroup: {},
      selectedEvent: {},
      isloading: true,
      location: null,
      selectedEventIdx: 0
    };
    this.getLoc = null;
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  componentDidMount = async () => {
    //Set state to info from props
    if (this.props.selectedGroup !== "{}" && this.props.location !== "{}") {
      this.setState({
        selectedGroup: this.props.selectedGroup,
        allEvents: this.props.events,
        user: this.props.user,
        locaion: this.props.location,
        isLoading: false,
        selectedEventIdx: this.props.selectedEventIdx
      });
    }

    if (JSON.stringify(this.state.allEvents) !== "{}") {
      this.setState({
        loadedEvents: true,
      });
    }
  };

  componentDidUpdate = async (prevProps) => {
    //If group location change, update state and map view
    let prevLat = parseFloat(prevProps.selectedGroup.lat);
    let prevLong = parseFloat(prevProps.selectedGroup.lng);
    let currLat = this.state.lat;
    let currLong = this.state.long;
    if (
      prevLat &&
      prevLong &&
      currLat &&
      currLong &&
      prevLat !== currLat &&
      prevLong !== currLong
    ) {
      this.setState({
        lat: parseFloat(this.props.selectedGroup.lat),
        long: parseFloat(this.props.selectedGroup.lng),
        viewport: {
          ...this.state.viewport,
          latitude: parseFloat(this.props.selectedGroup.lat),
          longitude: parseFloat(this.props.selectedGroup.lng),
        },
      });
    }

    //If events list get updated, also update events state
    if (prevProps.events !== this.state.allEvents) {
      await this.props.getAllEvents(this.props.selectedGroup.id);
      this.state.allEvents = this.props.events;
    }

    //If selected event changed, update event detail
    if (prevProps.selectedEventIdx !== this.props.selectedEventIdx) {
      let selected = this.state.allEvents.filter(
        (event) => event.id === this.props.selectedEventIdx
      );
      await this.setEventDetails(selected);
      this.setState({
        selectedEvent: this.props.selectedEvent,
      });
    }
  };

  render() {
    return this.state.isLoading ? (
      <div>Loading</div>
    ) : (
      <React.Fragment>
        <GroupNavbar />
        <div className="map page">
          <MapGL
            {...this.state.viewport}
            mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
            onViewportChange={(viewport) =>
              this.setState({
                viewport,
              })
            }
            mapboxApiAccessToken="pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA"
          >
            {/* <Marker
              latitude={this.props.location[1]}
              longitude={this.props.location[0]}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker1`} />
            </Marker> */}

            {Object.entries(this.state.allEvents).map((event, index) => {
              console.log("new entries", event);
              let icon;
              this.state.selectedEventIdx === index
                ? (icon = `highlightedEventMarker`)
                : (icon = `eventMarker`);
              return (
                <Marker
                  latitude={parseFloat(event[1].lat)}
                  longitude={parseFloat(event[1].lng)}
                  offsetLeft={-20}
                  offsetTop={-10}
                  key={event.id}
                >
                  <div
                    onClick={() => {
                      this.props.setSelectedIdx(index);
                    }}
                    className={icon}
                  />
                </Marker>
              );
            })}
          </MapGL>
        </div>
        {Object.keys(this.state.allEvents).length !== 0 && (
          <div className="overlay">
            <div className="content">
              <ReactSwipe
                swipeOptions={{
                  startSlide: this.state.selectedEventIdx,
                  continuous: true,
                  callback: (idx, ele) => {
                    this.props.setSelectedIdx(idx);
                    ele.setAttribute("data-index", this.props.selectedEventIdx);
                  },
                }}
                childCount={Object.entries(this.state.allEvents).length}
                style={customStyles}
              >
                {Object.entries(this.state.allEvents).map((event, idx) => (
                  <div key={event.id}>
                    <ul className="card__details">
                      <li className="card__name"> {event.name} </li>
                      <li className="card__name"> {event.startTime} </li>
                      <li className="card__name">{event.endTime}</li>
                      <li className="card__address">{event.location}</li>
                      <li className="card__address">{event.details}</li>
                    </ul>
                  </div>
                ))}
              </ReactSwipe>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedGroup: state.selectedGroup,
    events: { ...state.events },
    user: state.user,
    selectedEvent: state.selectedEvent,
    selectedEventIdx: state.selectedEventIdx,
    location: state.location.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllEvents: (groupId) => dispatch(getAllEvents(groupId)),
    setSelectedIdx: (idx) => dispatch(setSelectedIdx(idx)),
    // setIconImg: () => dispatch(setIconImg()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapBox);
