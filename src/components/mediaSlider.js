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
import Swipeable from "react-swipeable";
import {
  subredditArray,
  NSFW,
  artArray,
  foodArray,
  animalsArray
} from "../data/subreddits.js";
class MediaSlider extends Component {
  constructor(props) {
    super(props);
    React.CreateRef = this.renderFocus = React.createRef();

    this.state = {
      isLoading: false,
      // isOnlyGifsShowing: false,
      loop: true,
      autoPlay: true,
      sliderData: [],
      subreddit: "",
      activeSlide: 0,
    };
  }
  componentDidMount() {
    message.info(
      `Category is ${
        this.props.match.params.category
      }, press or swipe right to shuffle subreddit`
    );
  }
  dataHandler(props) {
    if (props === "NSFW") {
      return NSFW;
    }
    if (props === "SFW") {
      return subredditArray;
    }
    if (props === "Art") {
      return artArray;
    }
    if (props === "Food") {
      return foodArray;
    }
    if (props === "Animals") {
      return animalsArray;
    } else {
      return subredditArray;
    }
  }
  getSubreddit = async subreddit => {
    await this.setState({
      subreddit: subreddit,
      sliderData: [],
      isLoading: true
    });
    //Om det blev fel kan det vara annat än url som inte finns...
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?limit=100`
    )
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
          after: jsonData.data.after,
          before: jsonData.data.after
        });
        let childs = jsonData.data.children;
        this.dataToHtml(childs);
        console.log(this.state.activeSlide);
      })
      .catch(() => {
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.props.match.params.category))
        );
      });
    this.setState({ isLoading: false });
  };
  goBackSubreddits = async () => {
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?before=${
        this.state.before
      }&limit=100`
    )
      .then(response => response.json())
      .then(jsonData => {
        let childs = jsonData.data.children;
        this.dataToHtml(childs);
        this.setState({
          after: jsonData.data.after,
          activeSlide: this.state.sliderData.length - 1,
          before: jsonData.data.before
        });
      })
      .catch(() => {
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.props.match.params.category))
        );
      });
    this.setState({ isLoading: false });
  };

  moreSubreddits = async () => {
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?after=${
        this.state.after
      }&limit=100`
    )
      .then(response => response.json())
      .then(jsonData => {
        let childs = jsonData.data.children;
        this.dataToHtml(childs);
        this.setState({
          after: jsonData.data.after,
          activeSlide: 0,
          before: jsonData.data.after
        });
      })
      .catch(() => {
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.props.match.params.category))
        );
      });
    this.setState({ isLoading: false });
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
//Isvideoloading
isVideoLoading = () => {
  this.state.sliderData.length === 0
    ? this.setState({ spinning: true })
    : this.setState({ spinning: false });
};

//SEARCH
handleSearch = value => {
  if (!value) {
    value = "Type your search";
  }
  let result = this.dataHandler(this.props.category).filter(str =>
    str.toLowerCase().includes(value.toLowerCase())
  );
  result = result.reverse();
  result.push(value);
  result = result.reverse();
  this.setState({ dataSource: result.slice(0, 7) });
  console.log(this.state.dataSource);
};
onSelect = value => {
  this.getSubreddit(value);
  this.searchBoxOpenClose();
};
searchBoxOpenClose = () => {
  this.setState({ isSearchActivated: !this.state.isSearchActivated });
};
  render() {
    console.log(()=>this.getSubreddit())
    return (
      <Swipeable
        className="wrapper"
        onKeyDown={this.handleKeyDown}
        onSwipedDown={this.swipedDown}
        onSwipedUp={this.swipedUp}
        onSwipedLeft={this.swipedLeft}
        onSwipedRight={this.swipedRight}
      >
        {this.state.isLoading ? (
          <button autoFocus className="subRedditTitle">
            <Spin wrapperClassName="subRedditTitle" size="large" />
            <p className="loading">
              Loading <Icon type="tag-o" />
              {this.state.subreddit}
            </p>
          </button>
        ) : (
          <div>
            {this.videoPlayer && this.state.isVideoLoading && (
              <Icon
                style={{
                  zIndex: 44,
                  color: "white",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  fontSize: "50px"
                }}
                type="loading"
              />
            )}

            {this.state.sliderData[this.state.activeSlide]}
          </div>
        )}
        <div className="downDiv">
          <button onClick={this.next} className="iconDownClicker">
            <Icon className="iconDown" type="arrow-down" />
          </button>
        </div>
      </Swipeable>
    );
  }
  dataToHtml = data => {
    let zeroNullData = false;
    let datavar = data.map((children, i) => {
      if (
        children.data.post_hint === "link" &&
        children.data.preview.reddit_video_preview
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              timeout={1000}
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  playsInline
                  autoPlay={this.state.autoPlay}
                  poster={this.imageParser(
                    children.data.preview.images[0].resolutions[1].url || ""
                  )}
                  preload="none"
                  loop={this.state.loop}
                >
                  <source
                    type="video/mp4"
                    src={
                      children.data.preview.reddit_video_preview
                        .scrubber_media_url
                    }
                  />

                  <p>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }

      if (
        children.data.post_hint === "rich:video" &&
        children.data.preview.reddit_video_preview
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              timeout={1000}
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  preload="none"
                  playsInline
                  autoPlay={this.state.autoPlay}
                  poster={children.data.thumbnail || ""}
                  loop={this.state.loop}
                >
                  <source
                    type="video/mp4"
                    src={
                      children.data.preview.reddit_video_preview
                        .scrubber_media_url
                    }
                  />
                  <p>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }
      if (
        children.data.post_hint === "hosted:video" &&
        children.data.media.reddit_video
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              timeout={1000}
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  playsInline
                  autoPlay={this.state.autoPlay}
                  loop={this.state.loop}
                  preload="none"
                >
                  <source
                    type="video/mp4"
                    src={children.data.media.reddit_video.scrubber_media_url}
                  />
                  <p>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={children.data.media.reddit_video.scrubber_media_url}
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }

      if (
        children.data.post_hint === "image" &&
        children.data.preview.reddit_video_preview
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              timeout={1000}
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  playsInline
                  autoPlay={this.state.autoPlay}
                  poster={this.imageParser(
                    children.data.preview.images[0].resolutions[1].url || ""
                  )}
                  loop={this.state.loop}
                  preload="none"
                >
                  <source
                    type="video/mp4"
                    src={
                      children.data.preview.reddit_video_preview
                        .scrubber_media_url
                    }
                  />
                  <p className="titleText">
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }

      if (
        children.data.post_hint === "image" &&
        !this.state.isOnlyGifsShowing
      ) {
        let sizeRatio =
          children.data.preview.images[0].source.height +
          children.data.preview.images[0].source.width;
        if (children.data.preview.images[0].source.height < 300) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
               <h2 className="titlesLeft">
              <Icon type="tag-o" />
              {this.state.subreddit}
            </h2>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                timeout={1000}
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].source.url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.preview.images[0].resolutions[3] &&
          sizeRatio > 1500
        ) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
               <h2 className="titlesLeft">
              <Icon type="tag-o" />
              {this.state.subreddit}
            </h2>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                timeout={1000}
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].resolutions[3].url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.preview.images[0].resolutions[4] &&
          sizeRatio < 1500
        ) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
               <h2 className="titlesLeft">
              <Icon type="tag-o" />
              {this.state.subreddit}
            </h2>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                timeout={1000}
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].resolutions[4].url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }
      } else {
        return null;
      }
      return null;
    });
    if (zeroNullData === true) {
      this.setState({ sliderData: datavar.filter(e => e !== null) });
    } else {
      this.getSubreddit(
        this.shuffleArray(this.dataHandler(this.props.match.params.category))
      );
    }
  };
}

export default MediaSlider;
