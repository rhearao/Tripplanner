import React, { Component } from "react";
import { connect } from "react-redux";
// import getUserId from "../store/upload";
import { uploadPhoto } from "../store/upload";
import { withRouter } from "react-router-dom";
import { updateUserThunk } from "../store/user";

class UploadPhoto extends Component {
  state = {
    valid: false,
    fileName: "",
    file: null,
    delete: false,
  };

  onChange = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    this.setState({
      valid: validity.valid,
      fileName: file ? file.name : null,
      file,
      delete: false,
    });
    this.props.setPreviewImage(file);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const image = this.state.file;

    if (image && this.state.valid) {
      // this.props.getUserId(this.props.user.id);
      console.log("the user id is ", this.props.user.id);
      const url = await this.props.uploadPhoto(image, this.props.user);
      console.log("url", url);
      this.props.refresh(url);
      // this.props.updateUserThunk(this.props.user.id, this.props.user);
      // this.props.history.push(`/home`);
      // window.history.go(-1);
    } else if (this.state.delete) {
      this.props.cancelEdit(this.props.original);
    } else {
      this.props.cancelEdit(this.props.original);
    }
  };

  reset = () => {
    this.setState({
      valid: false,
      fileName: "",
      file: null,
      delete: true,
    });
    this.props.setPreviewImage(null);
  };

  getText = () => {
    if (this.state.delete) {
      return "Delete your image?";
    }
    if (!this.state.fileName) {
      return "Choose an image";
    }
    if (!this.state.valid && this.state.fileName) {
      return "Invalid Image";
    }
    if (this.state.valid && this.state.fileName) {
      return null;
    }
    return null;
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <center> 
        <input
          className="file-input"
          type="file"
          name="image"
          accept=".jpeg,.jpg,.png"
          onChange={this.onChange}
        />
        
        {this.getText() || <button className="button">Submit</button>}
        </center> 
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

// const mapDispatchToProps = (dispatch, props) => {
//   return {
//     uploadPhoto: (id, image) => dispatch()
//   };
// };

export default withRouter(
  connect(mapStateToProps, { uploadPhoto, updateUserThunk })(UploadPhoto)
);
