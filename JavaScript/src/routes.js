import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch } from "react-router-dom";

import {
  Login,
  Signup,
  UserProfile,
  UserGroup,
  CreateGroup,
  GroupProfile,
  Event,
  CreateEvent,
  MapBox
} from "./components";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevDepth: this.getPathDepth(this.props.location),
    };
  }

  componentWillReceiveProps() {
    this.setState({ prevDepth: this.getPathDepth(this.props.location) });
  }

  // If we did to go to certain
  //   componentDidMount() {
  //     if (this.props.grouped) {
  //       this.props.history.push("/group/:groupId");
  //     } else {
  //       this.props.history.push("/home/group");
  //     }
  //   }

  getPathDepth(location) {
    let pathArr = location.pathname.split("/");
    pathArr = pathArr.filter((n) => n !== "");
    return pathArr.length;
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <Login />} />
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/signup" component={Signup} />
        <Route path="/home/profile" component={UserProfile} />
        <Route exact path="/home/group" component={UserGroup} />
        <Route exact path="/home/group/create" component={CreateGroup} />
        <Route exact path="/home/event/create" component={CreateEvent} />
        <Route exact path="/group/:groupid" component={GroupProfile} />
        <Route path="/group/:groupId/event" component={Event} />
        <Route path="/group/:groupId/map" component={MapBox} />
        {/*<Route path="/group/:groupId" component={ GroupProfile } />
                <Route path="/group/:groupId/map" component={ GroupMap } />
                <Route path="/group/:groupId/event" component={ GroupEvent } /> */}
      </Switch>
    );
  }
}

const mapStateToProps = ({
  user,
  //   group: {
  //     selectedGroup: { grouped },
  //   },
}) => ({
  user,
  //   grouped,
});

export default withRouter(connect(mapStateToProps)(Routes));
