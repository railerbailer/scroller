import React, { Component } from "react";
import "../App.css";
import { Button, message } from "antd";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import * as utils from "../utils/utils.js";

class CategoryButtons extends Component {
  
  renderMenu = () => {
    const categories = ["nsfw", "sfw", "art", "animals", "food"];
    const buttons = categories.map((category, key) => (
      <Button 
      onClick={()=>this.props.changeCategory(utils.shuffleArray(utils.dataHandler((category))))} 
      key={key} className={category}>
        <Link to={`/${category}`}>{category}</Link>
      </Button>
    ));
    return buttons;
  };

  render() {
    return (
      <div className="categoryModal">
        <div className="description">
          Welcome to Sliddit.com!
          <br />
          Choose a category:
        </div>
        <div className="grid-container">
          {this.renderMenu()}
        </div>
      </div>
    );
  }
}

export default CategoryButtons;
