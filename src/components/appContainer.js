import React, { Component } from "react";
import "../App.css";

import CategoryButtons from "./categoryButtons.js";
import MediaSlider from "./mediaSlider";
import TopMenu from "./topMenu.js";

import "antd/dist/antd.css";

import { BrowserRouter, Route, Link } from "react-router-dom";

class AppContainer extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <TopMenu />
          <Route path="/slider/:category/:subreddit" component={MediaSlider} />
          <Route path="/" exact component={CategoryButtons} />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default AppContainer;
