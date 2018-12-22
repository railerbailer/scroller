import CategoryButtons from "./categoryButtons.js";
import MediaSlider from "./mediaSlider";
import TopMenu from "./topMenu.js";
import React, { Component } from "react";
import "../App.css";

class AppContainer extends Component {
  render() {
    return (
      <React.Fragment>
        <TopMenu />
        <MediaSlider />
        <CategoryButtons />
      </React.Fragment>
    );
  }
}

export default AppContainer;
