import React, { Component } from "react";
import "../App.css";
import { Icon, Button, Spin, message, notification } from "antd";
import { debounce } from "lodash";
import { Transition } from "react-transition-group";
import Swipeable from "react-swipeable";
import { Redirect } from "react-router-dom";

import {
  subredditArray,
  NSFW,
  artArray,
  foodArray,
  animalsArray
} from "../data/subreddits.js";
let goBack = [];
let goBackIndex = 0;
class MediaSlider extends Component {
  constructor(props) {
    super(props);
    React.CreateRef = this.renderFocus = React.createRef();

    this.state = {
      isLoading: false,
      isOnlyGifsShowing: false,
      loop: true,
      autoPlay: true,
      sliderData: [],
      subreddit: "",
      activeSlide: 0,
      imageQuality: 2
    };
  }
  componentDidMount() {
    // await this.test();
    this.getSubreddit(this.props.match.params.subreddit);

    message.info(
      `Category is ${
        this.props.match.params.category
      }, press or swipe right to shuffle subreddit`
    );
  }
  shuffleArray = array => {
    let random = Math.floor(Math.random() * array.length);
    return array[random];
  };
  //checks for file type
  checkGif(url) {
    return url.match(/\.(gif)$/) !== null;
  }
  checkImg(url) {
    return url.match(/\.(jpeg|jpg|png)$/) !== null;
  }

  removeHtmlFromUrl(url) {
    let editedUrl = "";
    editedUrl = url
      .replace(/&gt;/gi, ">")
      .replace(/&lt;/gi, "<")
      .replace(/&amp;/gi, "&");
    return editedUrl;
  }

  next = debounce(async () => {
    this.state.sliderData.length - 1 === this.state.activeSlide &&
      this.setState({ activeSlide: -1 });
    this.setState({ activeSlide: this.state.activeSlide + 1 });
    this.setState({ isVideoLoading: this.videoPlayer && true });
    this.state.isDropDownShowing && this.showDropDown();

    !this.state.activeSlide &&
      this.state.sliderData.length &&
      this.moreSubreddits();
  }, 100);
  previous = async () => {
    if (this.state.activeSlide) {
      const infiniteScroll =
        (await this.state.activeSlide) <= 0
          ? this.state.sliderData.length && this.state.sliderData.length - 1
          : this.state.activeSlide - 1;
      this.setState({ activeSlide: infiniteScroll });
      this.setState({ isVideoLoading: this.videoPlayer && true });
    }
    // this.state.activeSlide===0 && this.goBackSubreddits();
  };

  switchCat = async () => {
    this.state.isDropDownShowing && this.showDropDown();
    this.setState({ isVideoLoading: true });
    await this.setState({ activeSlide: 0 });
    if (goBackIndex > 0) {
      goBackIndex = goBackIndex - 1;
      if (this.state.subreddit === goBack[goBack.length - 1 - goBackIndex]) {
        !this.state.isLoading &&
          this.getSubreddit(goBack[goBack.length - goBackIndex]);
      } else
        !this.state.isLoading &&
          this.getSubreddit(goBack[goBack.length - 1 - goBackIndex]);
    } else {
      !this.state.isLoading &&
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.props.match.params.category))
        );
      if (
        goBackIndex === 0 &&
        goBack[goBack.length - 1] !== this.state.subreddit
      ) {
        await goBack.push(this.state.subreddit);
      }
    }
  };

  goBackToLast = async () => {
    this.setState({ isVideoLoading: true });
    if (goBack.length > 1 && goBack[0] !== this.state.subreddit) {
      if (this.state.subreddit === goBack[goBack.length - 1 - goBackIndex]) {
        this.getSubreddit(goBack[goBack.length - 2 - goBackIndex]);
      } else this.getSubreddit(goBack[goBack.length - 1 - goBackIndex]);
    }
    goBackIndex < goBack.length
      ? (goBackIndex = goBackIndex + 1)
      : console.log("doing nothin...");

    if (!goBack.includes(this.state.subreddit)) {
      await goBack.push(this.state.subreddit);
    }
  };

  handleKeyDown = e => {
    const { isSearchActivated } = this.state;
    if (e.key === "ArrowLeft") {
      !isSearchActivated && this.goBackToLast();
    }
    if (e.key === "a") {
      !isSearchActivated && this.goBackToLast();
    }
    if (e.key === "ArrowDown") {
      !isSearchActivated && this.next();
    }

    if (e.key === "s") {
      !isSearchActivated && this.next();
    }
    if (e.key === "w") {
      !isSearchActivated && this.previous();
    }
    if (e.key === " ") {
      if (this.videoPlayer) {
        if (this.videoPlayer.paused) {
          !isSearchActivated && this.videoPlayer.play();
        } else !isSearchActivated && this.videoPlayer.pause();
      }
    }

    if (e.key === "ArrowUp") {
      !isSearchActivated && this.previous();
    }
    if (e.key === "ArrowRight") {
      !isSearchActivated && this.switchCat();
    }
    if (e.key === "d") {
      !isSearchActivated && this.switchCat();
    }
  };
  dataHandler(props) {
    if (props === "nsfw") {
      return NSFW;
    }
    if (props === "sfw") {
      return subredditArray;
    }
    if (props === "art") {
      return artArray;
    }
    if (props === "food") {
      return foodArray;
    }
    if (props === "animals") {
      return animalsArray;
    } else {
      return subredditArray;
    }
  }
  getSubreddit = async subreddit => {
    console.log(subreddit);
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
        console.log(childs);
        this.dataToHtml(childs);
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
    let result = this.dataHandler(this.props.match.params.category).filter(
      str => str.toLowerCase().includes(value.toLowerCase())
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
    console.log(this.props.match);

    return (
      <Swipeable
        className="wrapper"
        onKeyDown={this.handleKeyDown}
        onSwipedDown={this.swipedDown}
        onSwipedUp={this.swipedUp}
        onSwipedLeft={this.swipedLeft}
        onSwipedRight={this.swipedRight}
      >
        {!this.state.isSearchActivated && (
          <button
            ref={button =>
              button && !this.state.isSearchActivated && button.focus()
            }
          />
        )}
        {/* <Redirect push to={`/${this.props.match.params.category}/${this.props.match.params.subreddit}`}/> */}
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
    let datavar = data.map((children, i) => {
      const { preview, thumbnail, media, title, post_hint } = children.data;
      const { images, reddit_video_preview } = preview;

      if (post_hint === "image")
        return (
          <div className="imgDiv" key={i}>
            <p className="titleText">{title}</p>
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
                  src={this.removeHtmlFromUrl(
                    images[0].resolutions[this.state.imageQuality].url
                  )}
                  alt={this.removeHtmlFromUrl(images[0].source.url)}
                />
              )}
            </Transition>
          </div>
        );
      else
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{title}</p>
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
                  poster={this.removeHtmlFromUrl(
                    (preview && images[0].resolutions[0].url) || thumbnail
                  )}
                  preload="auto"
                  loop={this.state.loop}
                >
                  <source
                    type="video/mp4"
                    src={
                      reddit_video_preview &&
                      reddit_video_preview.scrubber_media_url
                    }
                  />
                  <source
                    type="video/mp4"
                    src={
                      media &&
                      media.reddit_video &&
                      media.reddit_video.scrubber_media_url
                    }
                  />

                  <p>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={
                        reddit_video_preview &&
                        reddit_video_preview.scrubber_media_url
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
    });

    this.setState({ sliderData: datavar.filter(e => e !== null) });
  };

  olddataToHtml = data => {
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
                  poster={this.removeHtmlFromUrl(
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
                  poster={this.removeHtmlFromUrl(
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
                    src={this.removeHtmlFromUrl(
                      children.data.preview.images[0].source.url
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
const styles = {
  iconLeft: {
    cursor: "pointer",
    backgroundColor: "transparent",
    opacity: 0.6,
    height: "100%",
    position: "absolute",
    zIndex: 1,
    paddingRight: "20%",
    right: 1,
    textAlign: "left",
    fontSize: "24px",
    color: "white",
    left: 0
  },
  iconRight: {
    cursor: "pointer",
    backgroundColor: "transparent",
    opacity: 0.6,
    height: "100%",
    position: "absolute",
    zIndex: 1,
    paddingLeft: "20%",
    right: 1,
    textAlign: "right",
    fontSize: "24px",
    color: "white"
  }
};
