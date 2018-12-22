import React, { Component } from "react";
import "../App.css";
import { Button, message } from "antd";
import "antd/dist/antd.css";
class CategoryButtons extends Component {
  pickCategory = async (e, cat) => {
    await e.preventDefault();
    await this.props.categorySet(cat);
    await this.getSubreddit(this.shuffleArray(this.dataHandler(cat)));
    message.info(
      `Category is ${cat}, press or swipe right to shuffle subreddit`
    );
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
          <Button className="item1" onClick={e => this.pickCategory(e, "NSFW")}>
            NSFW
          </Button>

          <Button className="item2" onClick={e => this.pickCategory(e, "Art")}>
            ART
          </Button>

          <Button className="item3" onClick={e => this.pickCategory(e, "Food")}>
            FOOD
          </Button>

          <Button className="item4" onClick={e => this.pickCategory(e, "SFW")}>
            SFW
          </Button>

          <Button
            className="item5"
            onClick={e => this.pickCategory(e, "Animals")}
          >
            ANIMALS
          </Button>
        </div>
      </div>
    );
  }
}

export default CategoryButtons;
