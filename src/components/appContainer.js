import React, { Component } from "react";
import "../App.css";

import CategoryButtons from "./categoryButtons.js";
import MediaSlider from "./mediaSlider";

import "antd/dist/antd.css";

import { BrowserRouter, Route } from "react-router-dom";

class AppContainer extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route path="/:category" component={MediaSlider} />
          <Route path="/NSFW/:subreddit" component={MediaSlider} />
          <Route path="/SFW/:subreddit" component={MediaSlider} />
          <Route path="/ART/:subreddit" component={MediaSlider} />
          <Route path="/ANIMALS/:subreddit" component={MediaSlider} />
          <Route path="/FOOD/:subreddit" component={MediaSlider} />
          <Route path="/" exact component={CategoryButtons} />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default AppContainer;
