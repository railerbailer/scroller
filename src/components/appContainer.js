import React, { Component } from "react";
import "../App.css";

import CategoryButtons from "./categoryButtons.js";
import MediaSlider from "./mediaSlider";
import TopMenu from "./topMenu.js";

import "antd/dist/antd.css";

import { BrowserRouter, Route } from "react-router-dom";

class AppContainer extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route path="/:category/:subreddit" exact component={MediaSlider} />
          <Route path="/:category" exact component={MediaSlider} />
          <Route path="/" exact component={MediaSlider} />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default AppContainer;
