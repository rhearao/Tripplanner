import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import ReactModal from "react-modal";
import SwipeLayer from "./SwipeLayer";
import { connect } from "react-redux";
import { setUserLocation, getMatchLocation } from "../store";
import { setSelectedIdx } from "../store/highlight";
import { getMatchPreference } from "../store/matchPreference";
import { joinChatRoom, clearUnread } from "../store/chat";
import { setVenueDetails } from "../store/venueDetail";
import { createVenueList } from "../store/food";
import { setIconImg } from "../store/icon";
import Chat from "./chat";
import "./mapstyles.css";
import Nav from "./Nav";
import t from "typy";
import axios from "axios";

// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// }

export class MapBox extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        width: "100%",
        height: "100vh",
        latitude: 40.754,
        longitude: -73.984,
        zoom: 14
      },
      lat: 40.754,
      long: -73.984,
      allVenues: [],
      // THE BELOW MATCH PREFERENCES JUST HAS SOME PLACEHOLDER PREFERENCES FOR TESTING
      matchPreferences: [],
      loadedVenues: false,
      loadedUser: false,
      selectedRestaurant: {},
      selectedRestaurantDetails: {}
    };
    this.getLoc = null;
  }

  async componentDidMount() {
    this.getLoc = new Promise((resolve, reject) => {
      let lat = this.props.userLat;
      let long = this.props.userLong;
      resolve([long, lat]);
      this.setState(
        {
          viewport: {
            ...this.state.viewport,
            latitude: lat,
            longitude: long
          },
          lat,
          long,
          loadedUser: true
        },
        resolve
      );
    });

    const [long, lat] = await this.getLoc;
    await this.props.getMatchLocation();
    let distance =
      Math.sqrt(
        (lat - this.props.matchLat) ** 2 + (long - this.props.matchLong) ** 2
      ) * 111000;
    let midpointLat = (lat + this.props.matchLat) / 2;
    let midpointLong = (long + this.props.matchLong) / 2;
    this.props.joinChatRoom();
    this.props.setIconImg();
    this.props.createVenueList();
    this.setState(
      {
        matchPreferences: this.props.matchInfo
          ? this.props.matchInfo.preferences
          : this.state.matchPreferences
      },
      async () => {
        await this.getVenues(
          midpointLat,
          midpointLong,
          distance > 500 ? distance : 500
        );
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.userLat !== this.state.lat ||
      this.props.userLong !== this.state.long
    ) {
      this.setState({
        lat: this.props.userLat,
        long: this.props.userLong,
        viewport: {
          ...this.state.viewport,
          latitude: this.props.userLat,
          longitude: this.props.userLong
        }
      });
    }

    if (prevProps.selectedRestaurant !== this.props.selectedRestaurant) {
      let selected = this.state.allVenues.filter(
        venue => venue.id === this.props.selectedRestaurant
      );
      this.getVenuesDetails(selected);
      this.setState({
        selectedRestaurant: {
          name: t(selected[0], "name").safeObject,
          address: t(selected[0], "location.address").safeObject,
          city: t(selected[0], "location.city").safeObject,
          state: t(selected[0], "location.state").safeObject,
          price: t(selected[0], "price.tier").safeObject,
          currency: t(selected[0], "price.currency").safeObject,
          rating: t(selected[0], "rating").safeObject,
          categories: t(selected[0], "categories[0].shortName").safeObject,
          photo: t(selected[0], "bestPhoto").safeObject
        }
      });
    }
    if (this.state.selectedRestaurantDetails.name) {
      this.props.setVenueDetails(this.state.selectedRestaurantDetails);
    }
  }

  // FourSquare API or Self-entered event details
  getEventDetails = async selected => {
    const venueId = selected[0].id;
    const params = {
      client_id: "NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ",
      client_secret: "YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM",
      v: "20130619"
    };
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?&client_id=${
      params.client_id
    }&client_secret=${params.client_secret}&v=${params.v}`;

    const res = await axios.get(venuesEndpoint);
    const { venue } = res.data.response;
    console.log("selected restaurant", venue);
    this.setState({
      selectedEventDetails: {
        name: t(venue, "name").safeObject,
        address: t(venue, "location.address").safeObject,
        city: t(venue, "location.city").safeObject,
        state: t(venue, "location.state").safeObject,
        price: t(venue, "price.tier").safeObject,
        currency: t(venue, "price.currency").safeObject,
        rating: t(venue, "rating").safeObject,
        categories: t(venue, "categories[0].shortName").safeObject,
        photo: t(venue, "bestPhoto").safeObject,
        eventLat: event.location.lat,
        eventLong: event.location.lng
      }
    });
  };

  getEvents = async (lat, long, radius) => {
    console.log("RADIUS", radius);
    const venuesEndpoint = "https://api.foursquare.com/v2/venues/search?";

    const params = {
      client_id: "NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ",
      client_secret: "YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM",
      limit: 5,
      v: "20130619", // version of the API
      intent: "browse",
      ll: `${lat}, ${long}`,
      radius,
      categoryId: this.state.matchPreferences.join(",")
      // + ",4d4b7105d754a06374d81259"
    };

    await fetch(venuesEndpoint + new URLSearchParams(params), {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        // filter out those places without category names
        console.log(response);
        this.setState({
          allVenues: response.response.venues,
          loadedVenues: true
        });
      });
  };

  //chat functions
  handleOpenChat = () => {
    let chat = document.querySelector(".chatBox");
    chat.classList.add("is-visible");
    this.props.clearUnread();
  };

  handlePopupClose = () => {
    this.props.history.push("/navigation");
  };


  render() {
    return (
      <React.Fragment>
        <Nav />
        <div className="map page">
          <MapGL
            {...this.state.viewport}
            mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
            onViewportChange={viewport =>
              this.setState({
                viewport
              })
            }
            mapboxApiAccessToken="pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA"
          >
            <Marker
              latitude={this.props.userLat}
              longitude={this.props.userLong}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker${this.props.icon1}`} />{" "}
            </Marker>{" "}
            <Marker
              latitude={this.props.matchLat}
              longitude={this.props.matchLong}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker${this.props.icon2}`} />{" "}
            </Marker>{" "}
            {this.state.allVenues.map((item, index) => {
              let icon;
              this.props.selectedIdx === index
                ? (icon = `highlightedFooodMarker`)
                : (icon = `foodMarker`);
              return (
                <Marker
                  latitude={item.location.lat}
                  longitude={item.location.lng}
                  offsetLeft={-20}
                  offsetTop={-10}
                  key={item.id}
                >
                  <div
                    onClick={() => {
                      this.props.setSelectedIdx(index);
                    }}
                    className={icon}
                  />{" "}
                </Marker>
              );
            })}{" "}
          </MapGL>{" "}
        </div>{" "}
        <button className="chatBubble" onClick={this.handleOpenChat}>
          <i class="fas fa-comment-alt" />
        </button>{" "}
        {this.props.unreadMsg > 0 ? (
          <button className="chatBubble unread" onClick={this.handleOpenChat}>
            <i class="fas fa-comment-alt" />
          </button>
        ) : (
          <button className="chatBubble" onClick={this.handleOpenChat}>
            <i class="fas fa-comment-alt" />
          </button>
        )}{" "}
        <Chat />{" "}
        {this.state.loadedVenues && (
          <div className="overlay">
            <div className="content">
              <SwipeLayer allVenues={this.state.allVenues} />{" "}
            </div>{" "}
          </div>
        )}{" "}
        {this.props.loadingLoc && (
          <ReactModal
            isOpen={this.props.loadingLoc ? true : false}
            shouldCloseOnOverlayClick={true}
            closeTimeoutMS={5000}
            contentLabel="matchLocation loading Page"
            className="congrats__content"
            overlayClassName="congrats__overlay"
          >
            <i class="fas fa-spinner fa-spin fa-5x" />
            <br />
            <div>
              {" "}
              Waiting for {this.props.matchName}
              's location{" "}
            </div>{" "}
          </ReactModal>
        )}{" "}
        <ReactModal
          isOpen={this.props.selectedRestaurant ? true : false}
          shouldCloseOnOverlayClick={true}
          closeTimeoutMS={5000}
          contentLabel="Restaurant Selected Popup"
          className="congrats__content"
          overlayClassName="congrats__overlay"
        >
          <i className="fas fa-utensils congrats__icon" />
          <h1 className="congrats__title"> Congratulations! </h1>
          <p className="congrats__text">
            You have both selected {this.state.selectedRestaurantDetails.name}
          </p>
          <span className="congrats__text"> {this.createStars()} </span>
          {this.createCurrency() !== "" ? (
            <span className="congrats__text"> {this.createCurrency()} </span>
          ) : (
            ""
          )}
          <span className="congrats__text">
            {this.state.selectedRestaurantDetails.address}
          </span>
          <span className="congrats__text">
            {this.state.selectedRestaurantDetails.city},
            {this.state.selectedRestaurantDetails.state}
          </span>
          <button
            className="congrats__button"
            onClick={() => {
              this.handlePopupClose();
            }}
          >
            Lets Go!
          </button>
        </ReactModal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loadingLoc: state.location.loading,
    userId: state.user.id,
    userLat: state.location.user[1],
    userLong: state.location.user[0],
    matchLat: state.location.match[1],
    matchLong: state.location.match[0],
    matchInfo: state.match.didMatch.info,
    selectedIdx: state.selectedIdx,
    icon1: state.icon.icon1,
    icon2: state.icon.icon2,
    selectedRestaurant: state.selectedRestaurant,
    unreadMsg: state.unreadMsg,
    matchName: state.match.didMatch.matched
      ? state.match.didMatch.info.firstName
      : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserLocation: arr => dispatch(setUserLocation(arr)),
    getMatchLocation: () => dispatch(getMatchLocation()),
    getMatchPreference: userId => dispatch(getMatchPreference(userId)),
    setSelectedIdx: idx => dispatch(setSelectedIdx(idx)),
    joinChatRoom: () => dispatch(joinChatRoom()),
    setIconImg: () => dispatch(setIconImg()),
    createVenueList: () => dispatch(createVenueList()),
    clearUnread: () => dispatch(clearUnread()),
    setVenueDetails: obj => dispatch(setVenueDetails(obj))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapBox);
