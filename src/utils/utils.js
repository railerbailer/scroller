import {
  subredditArray,
  NSFW,
  artArray,
  foodArray,
  animalsArray
} from "../data/subreddits.js";

export const dataHandler = props => {
  props = props.toLowerCase(); 
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
};

export const shuffleArray = array => {
  let random = Math.floor(Math.random() * array.length);
  return array[random];
};

export const checkGif = url => {
  return url.match(/\.(gif)$/) !== null;
};
export const checkImg = url => {
  return url.match(/\.(jpeg|jpg|png)$/) !== null;
};

export const removeHtmlFromUrl = url => {
  let editedUrl = "";
  editedUrl = url
    .replace(/&gt;/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&amp;/gi, "&");
  return editedUrl;
};

export const swipedLeft = (e, absX, isFlick) => {
  if (isFlick || absX > 30) {
    this.switchCat();
  }
};

export const swipedRight = (e, absX, isFlick) => {
  if (isFlick || absX > 30) {
    this.goBackToLast();
  }
};
export const swipedUp = (e, deltaY, isFlick) => {
  if (isFlick) {
    this.next();
  }
};
export const swipedDown = (e, deltaY, isFlick) => {
  if (isFlick) {
    this.previous();
  }
};

// olddataToHtml = data => {
//     let zeroNullData = false;
//     let datavar = data.map((children, i) => {
//       if (
//         children.data.post_hint === "link" &&
//         children.data.preview.reddit_video_preview
//       ) {
//         zeroNullData = true;
//         return (
//           <div className="videoDiv" key={i}>
//             <p className="titleText">{children.data.title}</p>
//             <Transition
//               in={true}
//               appear={true}
//               unmountOnExit
//               mountOnEnter
//               timeout={1000}
//             >
//               {status => (
//                 <video
//                   onCanPlay={() => this.setState({ isVideoLoading: false })}
//                   className={`video transition--${status}`}
//                   ref={el => (this.videoPlayer = el)}
//                   muted
//                   playsInline
//                   autoPlay={this.state.autoPlay}
//                   poster={this.utils.removeHtmlFromUrl(
//                     children.data.preview.images[0].resolutions[1].url || ""
//                   )}
//                   preload="none"
//                   loop={this.state.loop}
//                 >
//                   <source
//                     type="video/mp4"
//                     src={
//                       children.data.preview.reddit_video_preview
//                         .scrubber_media_url
//                     }
//                   />

//                   <p>
//                     Your browser doesn't support HTML5 video. Here is a{" "}
//                     <a
//                       href={
//                         children.data.preview.reddit_video_preview
//                           .scrubber_media_url
//                       }
//                     >
//                       link to the video
//                     </a>{" "}
//                     instead.
//                   </p>
//                 </video>
//               )}
//             </Transition>
//           </div>
//         );
//       }

//       if (
//         children.data.post_hint === "rich:video" &&
//         children.data.preview.reddit_video_preview
//       ) {
//         zeroNullData = true;
//         return (
//           <div className="videoDiv" key={i}>
//             <p className="titleText">{children.data.title}</p>
//             <Transition
//               in={true}
//               appear={true}
//               unmountOnExit
//               mountOnEnter
//               timeout={1000}
//             >
//               {status => (
//                 <video
//                   onCanPlay={() => this.setState({ isVideoLoading: false })}
//                   className={`video transition--${status}`}
//                   ref={el => (this.videoPlayer = el)}
//                   muted
//                   preload="none"
//                   playsInline
//                   autoPlay={this.state.autoPlay}
//                   poster={children.data.thumbnail || ""}
//                   loop={this.state.loop}
//                 >
//                   <source
//                     type="video/mp4"
//                     src={
//                       children.data.preview.reddit_video_preview
//                         .scrubber_media_url
//                     }
//                   />
//                   <p>
//                     Your browser doesn't support HTML5 video. Here is a{" "}
//                     <a
//                       href={
//                         children.data.preview.reddit_video_preview
//                           .scrubber_media_url
//                       }
//                     >
//                       link to the video
//                     </a>{" "}
//                     instead.
//                   </p>
//                 </video>
//               )}
//             </Transition>
//           </div>
//         );
//       }
//       if (
//         children.data.post_hint === "hosted:video" &&
//         children.data.media.reddit_video
//       ) {
//         zeroNullData = true;
//         return (
//           <div className="videoDiv" key={i}>
//             <p className="titleText">{children.data.title}</p>
//             <Transition
//               in={true}
//               appear={true}
//               unmountOnExit
//               mountOnEnter
//               timeout={1000}
//             >
//               {status => (
//                 <video
//                   onCanPlay={() => this.setState({ isVideoLoading: false })}
//                   className={`video transition--${status}`}
//                   ref={el => (this.videoPlayer = el)}
//                   muted
//                   playsInline
//                   autoPlay={this.state.autoPlay}
//                   loop={this.state.loop}
//                   preload="none"
//                 >
//                   <source
//                     type="video/mp4"
//                     src={children.data.media.reddit_video.scrubber_media_url}
//                   />
//                   <p>
//                     Your browser doesn't support HTML5 video. Here is a{" "}
//                     <a
//                       href={children.data.media.reddit_video.scrubber_media_url}
//                     >
//                       link to the video
//                     </a>{" "}
//                     instead.
//                   </p>
//                 </video>
//               )}
//             </Transition>
//           </div>
//         );
//       }

//       if (
//         children.data.post_hint === "image" &&
//         children.data.preview.reddit_video_preview
//       ) {
//         zeroNullData = true;
//         return (
//           <div className="videoDiv" key={i}>
//             <p className="titleText">{children.data.title}</p>
//             <Transition
//               in={true}
//               appear={true}
//               unmountOnExit
//               mountOnEnter
//               timeout={1000}
//             >
//               {status => (
//                 <video
//                   onCanPlay={() => this.setState({ isVideoLoading: false })}
//                   className={`video transition--${status}`}
//                   ref={el => (this.videoPlayer = el)}
//                   muted
//                   playsInline
//                   autoPlay={this.state.autoPlay}
//                   poster={this.utils.removeHtmlFromUrl(
//                     children.data.preview.images[0].resolutions[1].url || ""
//                   )}
//                   loop={this.state.loop}
//                   preload="none"
//                 >
//                   <source
//                     type="video/mp4"
//                     src={
//                       children.data.preview.reddit_video_preview
//                         .scrubber_media_url
//                     }
//                   />
//                   <p className="titleText">
//                     Your browser doesn't support HTML5 video. Here is a{" "}
//                     <a
//                       href={
//                         children.data.preview.reddit_video_preview
//                           .scrubber_media_url
//                       }
//                     >
//                       link to the video
//                     </a>{" "}
//                     instead.
//                   </p>
//                 </video>
//               )}
//             </Transition>
//           </div>
//         );
//       }

//       if (
//         children.data.post_hint === "image" &&
//         !this.state.isOnlyGifsShowing
//       ) {
//         let sizeRatio =
//           children.data.preview.images[0].source.height +
//           children.data.preview.images[0].source.width;
//         if (children.data.preview.images[0].source.height < 300) {
//           zeroNullData = true;
//           return (
//             <div className="imgDiv" key={i}>
//               <h2 className="titlesLeft">
//                 <Icon type="tag-o" />
//                 {this.state.subreddit}
//               </h2>
//               <p className="titleText">{children.data.title}</p>
//               <Transition
//                 in={true}
//                 appear={true}
//                 unmountOnExit
//                 mountOnEnter
//                 timeout={1000}
//               >
//                 {status => (
//                   <img
//                     className={`image transition--${status}`}
//                     src={this.utils.removeHtmlFromUrl(
//                       children.data.preview.images[0].source.url
//                     )}
//                     alt="{logo}"
//                   />
//                 )}
//               </Transition>
//             </div>
//           );
//         }
//       } else {
//         return null;
//       }
//       return null;
//     });
//     if (zeroNullData === true) {
//       this.setState({ sliderData: datavar.filter(e => e !== null) });
//     } else {
//       this.getSubreddit(
//         utils.shuffleArray(utils.dataHandler(this.props.match.params.category))
//       );
//     }
//   };
