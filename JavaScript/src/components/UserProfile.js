import React, { Component, useReducer } from "react";
import { connect } from "react-redux";
import { updateUserThunk, logout, me } from "../store/user";
import HomeNavbar from "./Homenavbar";
import UploadPhoto from "./UploadPhoto";
import "../CSS/style.css";
import { withRouter } from "react-router-dom";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      editingPhoto: false,
      photoURLs: this.props.user.photoURLs
        ? this.props.user.photoURLs[0]
        : null,
      image: null,
    };
  }

  async componentDidMount() {
    console.log("props here: ", this.props);
    this.setState({
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      password: this.props.user.password,
      photoURL: this.props.user.photoURLs ? this.props.user.photoURLs[0] : null,
    });
  }

  componentWillReceiveProps({ user, groups }) {
    this.setState({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photoURL: user.photoURLs,
      password: user.password,
    });
    // localStorage.setItem("groups", JSON.stringify(groups));
  }

  setPreviewImage(image) {
    if (image) {
      this.setState({ image: URL.createObjectURL(image) });
    } else {
      this.setState({ image: "/static/user_image.png" });
    }
  }

  cancelEdit(image) {
    this.setState({
      editingPhoto: false,
      image: null,
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.update(this.props.user.id, this.state);
  };

  handleUpload = () => {
    this.setState({
      editingPhoto: true,
    });
  };
  refresh = (url) => {
    this.setState({
      photoURL: url,
    });
  };
  render() {
    return (
      <React.Fragment>
        <HomeNavbar />
        <div className="home_profile">
          <div className="profile__photo">
            <h1 className="profile__title">Profile Picture</h1>
            <p className="profile__text">Upload a recent photo of yourself.</p>
            <img
              src={this.state.photoURL}
              // alt={this.state.firstName}
              className="profile__img"
            />
            {this.state.editingPhoto && (
              <UploadPhoto
                original={this.state.photoURL}
                setPreviewImage={this.setPreviewImage.bind(this)}
                refresh={(url) => this.refresh(url)}
              />
            )}
            <button
              className="profile__upload"
              type="button"
              onClick={() =>
                this.state.editingPhoto
                  ? this.cancelEdit()
                  : this.handleUpload()
              }
            >
              {this.state.editingPhoto ? "Cancel" : "Upload"}
            </button>
          </div>

          <div className="profile__details">
            <h1 className="profile__title">Details</h1>
            <p className="profile__text">Keep your information up-to-date.</p>
            <div className="profile__container">
              <form className="profile__list" onSubmit={this.handleSubmit}>
                <input
                  className="profile__input"
                  type="text"
                  name="firstName"
                  onChange={this.handleChange}
                  value={this.state.firstName}
                  placeholder="First Name"
                />
                <input
                  className="profile__input"
                  type="text"
                  name="lastName"
                  onChange={this.handleChange}
                  value={this.state.lastName}
                  placeholder="Last Name"
                />
                <input
                  className="profile__input"
                  type="text"
                  name="email"
                  onChange={this.handleChange}
                  value={this.state.email}
                  placeholder="Email"
                />
                <input
                  className="profile__input"
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                  value={this.state.password}
                  placeholder="Password"
                />
                <button className="profile__submit" type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    groups: state.groups,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    update: (id, user) => dispatch(updateUserThunk(id, user)),
    logout: () => dispatch(logout()),
    me: () => dispatch(me()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
