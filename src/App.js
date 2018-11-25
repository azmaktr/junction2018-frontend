import React, { Component } from "react";
import axios from "axios";
import Map from "./Map";
import { GoogleApiWrapper } from "google-maps-react";
import Autocomplete from "react-google-autocomplete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import "./App.css";

class App extends Component {
    state = {
        startDate: new Date(),
        markers: [],
        tags: [],
        polyCords: null,
        center: null
    };

  async requestApi(lat, lng) {
    const getdata = await axios.get(
      `http://gravity02-dev.azurewebsites.net/api/events?lat=${lat}&lon=${lng}&range=${2000}`
    );
    this.setState({
      markers: getdata.data
    });
  }

  onChange = date => this.setState({ startDate: date });

    handleTagChange = (tags) => {
        this.setState({tags})
    };

  render() {
    return (
      <div className="main-app-container">
        <h3>Telia Challenge</h3>
          <div className="input-container">
              <Autocomplete
                style={{width: '40%'}}
                onPlaceSelected={async place => {
                    const { lat, lng } = place.geometry.location;
                    this.setState({ center: { lat: lat(), lng: lng() } });
                    const apiData = await axios.get(
                        `http://10.100.31.58:8888/grid_id?lat=${lat()}&long=${lng()}`
                    );
                    const polyCords = apiData.data.poly_cords;
                    const RafayApiData = await axios.get(
                        `http://gravity02-dev.azurewebsites.net/api/events?lat=${lat()}&lon=${lng()}&range=${1000}`
                    );
                    if (polyCords) {
                        this.setState({
                            polyCords: polyCords.map(p => ({ lat: p[0], lng: p[1] })),
                            markers: RafayApiData.data
                        });
                    }
                }}
                types={["(regions)"]}
                componentRestrictions={{ country: "fi" }}
              />
              <DatePicker
                  selected={this.state.startDate}
                  onChange={this.onChange}
              />
              <TagsInput value={this.state.tags} onChange={this.handleTagChange} />
          </div>

          <Map
                  center={this.state.center}
                  markers={this.state.markers}
                  polyCords={this.state.polyCords}
                  onMapClick={() => {}}
              />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: `AIzaSyCR7DA6hA3Bm5m9tpxeFP9eW_teXWD-qrw`,
  libraries: ["places", "visualization"]
})(App);
