import React, { Component } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// If you want to use the provided css
import "react-google-places-autocomplete/dist/index.min.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/**
 * This component is responsibe for address autocomplete.
 * It uses Google Map Javascript API.
 * The script code is in index.html
 */

// const AutoComplete = () => (
//   <div>
//     <GooglePlacesAutocomplete onSelect={console.log} />
//   </div>
// );

class AutoComplete extends Component {
  state = {
    date: new Date(),
  };

  onChange = (date) => {
    this.setState({ date });
    console.log(date);
  };

  render() {
    return (
      <div>
        <div>
          <GooglePlacesAutocomplete
            onSelect={console.log}
            autocompletionRequest={{
              types: ["locality", "country"],
            }}
          />
        </div>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          selectRange
        />
      </div>
    );
  }
}

export default AutoComplete;
