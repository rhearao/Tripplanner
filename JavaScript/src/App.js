import React from "react";
import { connect } from "react-redux";
import Routes from "./routes";
import {
  me,
  postLocation,
  setUserLocation,
} from "./store";

class App extends React.Component {
  constructor(props){
    super(props)
    // this.state = {
    //   init: false
    // };
  }


  async componentDidMount() {
    const user = await this.props.me();
    console.log("app.js user ", user)
    if (user) {
      const locationPromise = new Promise(resolve => {
        window.navigator.geolocation.getCurrentPosition(
          pos => {
            this.props.postLocation(pos);
            resolve();
          },
          err => console.log(err),
          {
            timeout: 60000,
            enableHighAccuracy: false
          }
        );
      })

      // locationPromise.then(() => {
      //   this.setState({
      //     init: true
      //   });
      // })
    }
  }

  render() {
    // return this.state.init ? (
    //   <Routes />
    // ) : (
    //   <div>Loading...</div>
    // );
    return (
      <Routes />
    )
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(
  mapStateToProps,
  {
    me,
    postLocation,
    setUserLocation,
  }
)(App);
