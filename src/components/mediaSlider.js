import React, { Component } from "react";
import "../App.css";
import { Icon, Spin, message } from "antd";
import { debounce } from "lodash";
import { Transition } from "react-transition-group";
import Swipeable from "react-swipeable";
import { Redirect , Link} from "react-router-dom";
import * as utils from "../utils/utils.js";
import TopMenu from "./topMenu.js";
import CategoryButtons from "./categoryButtons";

let goBack = [];
let goBackIndex = 0;
let stopCatching = 0;
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
      imageQ: 1,
      isSearchActivated: false,
      isDropDownShowing: true
    };
  }
  componentDidMount() {
    this.getSubreddit(
      this.props.match.params.subreddit || 'nsfw'
    );
    message.info(
      `Category is ${
        this.props.match.params.category || 'NSFW'
      }, press or swipe right to shuffle subreddit`
    );
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
          utils.shuffleArray(
            utils.dataHandler(this.props.match.params.category || 'NSFW')
          )
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
    if (!isSearchActivated) {
      switch (e.key) {
        case "ArrowLeft":
          this.goBackToLast();
          break;

        case "a":
          this.goBackToLast();
          break;

        case "ArrowDown":
          this.next();
          break;

        case "s":
          this.next();
          break;

        case "w":
          this.previous();
          break;

        case " ": {
          this.videoPlayer && this.videoPlayer.paused
            ? this.videoPlayer && this.videoPlayer.play()
            : this.videoPlayer && this.videoPlayer.pause();
          break;
        }

        case "ArrowUp":
          this.previous();
          break;

        case "ArrowRight":
          this.switchCat();
          break;

        case "d":
          this.switchCat();
          break;
      }
    }
  };

  getSubreddit = async subreddit => {
    console.log('GETSUBREDDIT', subreddit);
    // this.props.match.params.category && this.props.history.push(`/${this.props.match.params.category}/${this.state.subreddit}`);
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
        let children = jsonData.data.children;
        console.log(children)
        this.dataToHtml(children);
      })
      .catch((e) => {
        console.log('errorERRORROEROEOR',e)
        stopCatching = stopCatching + 1;
        if (stopCatching > 10) {
          console.log("error");
          stopCatching = 0;
        } else
          this.getSubreddit(
            utils.shuffleArray(
              utils.dataHandler(this.props.match.params.category || 'NSFW')
            )
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
          utils.shuffleArray(
            utils.dataHandler(this.props.match.params.category || 'NSFW')
          )
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
          utils.shuffleArray(
            utils.dataHandler(this.props.match.params.category || 'NSFW')
          )
        );
      });
    this.setState({ isLoading: false });
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
    let result = utils
      .dataHandler(this.props.match.params.category || 'NSFW')
      .filter(str => str.toLowerCase().includes(value.toLowerCase()));
    result = result.reverse();
    result.push(value);
    result = result.reverse();
    this.setState({ dataSource: result.slice(0, 7) });
  };

  onSelect = value => {
    this.getSubreddit(value);
    this.searchBoxOpenClose();
  };

  searchBoxOpenClose = () => {
    this.setState({ isSearchActivated: !this.state.isSearchActivated });
  };

  showDropDown = () => {
    this.setState({ isDropDownShowing: !this.state.isDropDownShowing });
  };

  render() {
    console.log(this.props.match);

    return (
      <>
        <TopMenu
          category={this.props.match.params.category || 'NSFW'}
          onSelect={this.onSelect}
          changeCategory={utils.dataHandler}
          handleSearch={this.handleSearch}
          searchBoxOpenClose={this.searchBoxOpenClose}
          showDropDown={this.showDropDown}
          isSearchActivated={this.state.isSearchActivated}
          isDropDownShowing={this.state.isDropDownShowing}
        />
        {!this.props.match.params.category && <CategoryButtons changeCategory={this.getSubreddit} />}
        <Swipeable
          className="wrapper"
          onKeyDown={this.handleKeyDown}
          onSwipedDown={utils.swipedDown}
          onSwipedUp={utils.swipedUp}
          onSwipedLeft={utils.swipedLeft}
          onSwipedRight={utils.swipedRight}
        >
          {!this.state.isSearchActivated && (
            <button
              ref={button =>
                button && !this.state.isSearchActivated && button.focus()
              }
            />
          )}
          {this.state.isLoading ? (
            <button autoFocus className="subRedditTitle">
              <Spin wrapperClassName="subRedditTitle" size="large" />
              <p className="loading">
                Loading <Icon type="tag-o" />
                {this.state.subreddit}
              </p>
            </button>
          ) : (
            <div className="slider">
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
              <div className="hiddenClass">
                {this.state.activeSlide > 1 &&
                  this.state.sliderData[this.state.activeSlide + 1]}
              </div>
            </div>
          )}
          <div className="downDiv">
          <label>{this.state.subreddit}</label>
            <button onClick={this.next} className="iconDownClicker">
              <Icon className="iconDown" type="arrow-down" />
            </button>
          </div>
        </Swipeable>
      </>
    );
  }

  dataToHtml = data => {
    let datavar = data.map((children, i) => {
      if(!children.data.preview) return null;
      const { preview, thumbnail, media, title, post_hint } = children.data;
      const { images, reddit_video_preview } = preview;
      const { imageQ } = this.state;

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
                  src={utils.removeHtmlFromUrl(
                    images[0].resolutions[imageQ] && images[0].resolutions[imageQ].url || 'not working'
                  )}
                  alt={utils.removeHtmlFromUrl(images[0].source.url || 'not working')}
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
                  poster={utils.removeHtmlFromUrl(
                    images[0].resolutions[imageQ] && images[0].resolutions[imageQ].url || thumbnail || 'not working'
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

    this.setState({ sliderData: datavar.filter(e => e) });
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
