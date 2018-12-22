import React, { Component } from "react";
import "../App.css";
import {
    Icon,
    Button,
    Spin,
    message,
    notification,
    Menu,
    Dropdown,
    AutoComplete,
    Switch
  } from "antd";
  import { debounce } from "lodash";
  import { Transition } from "react-transition-group";

class MediaSlider extends Component {
    state = {
        responseToPost: '',
        post: ''
    }
    componentDidMount() {
        this.callApi()
          .then(res => this.setState({ response: res.express }))
          .catch(err => console.log(err));
      }
      callApi = async () => {
        const response = await fetch("/api/hello");
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
      };
      handleSubmit = async e => {
        const response = await fetch("/api/world", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ post: e })
        });
        const body = await response.text();
        this.setState({ responseToPost: body });
      };
    swipedLeft = (e, absX, isFlick) => {
        if (isFlick || absX > 30) {
          this.switchCat();
        }
      };
    
      swipedRight = (e, absX, isFlick) => {
        if (isFlick || absX > 30) {
          this.goBackToLast();
        }
      };
      swipedUp = (e, deltaY, isFlick) => {
        if (isFlick) {
          this.next();
        }
      };
      swipedDown = (e, deltaY, isFlick) => {
        if (isFlick) {
          this.previous();
        }
      };
  render() {
      console.log(this.state.responseToPost)
    return (
      <div>
        <Button onClick={()=>this.handleSubmit('lol')}>MediaSlider</Button>
      </div>
    );
  }
}

export default MediaSlider;
