import { useState, useRef, useEffect } from "preact/hooks";
import "./player.css";

export const VideoPlayer = ({meta, ...props}) => {
    const ref = useRef();

    useEffect(() => {
        // access the associated DOM element:
        console.log(ref.current)
      }, []);

    return (
    <div class="video-player" ref={ref} {...props}>
        <VideoPlayerBar player={ref}/>
    </div>);
};

export const VideoPlayerBar = ({ player }) => {
    const [fullscreen, setFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scrub, setScrub] = useState(-1);
    
    const calcScrub = e => {
        return e.offsetX / e.currentTarget.offsetWidth;
    };
    const requestFullscreen = (e) => {
        if (e.requestFullscreen) { e.requestFullscreen(); }
        else if (e.webkitRequestFullscreen) { e.webkitRequestFullscreen(); }
        else if (e.msRequestFullscreen) { e.msRequestFullscreen(); }

        setFullscreen(true);
    };
    const exitFullscreen = (e) => {
        if (e.exitFullscreen) { e.exitFullscreen(); }
        else if (e.webkitExitFullscreen) { e.webkitExitFullscreen(); }
        else if (e.msExitFullscreen) { e.msExitFullscreen(); }

        setFullscreen(false);
    };
    const toggleFullscreen = (e) => {
        if (fullscreen) { exitFullscreen(document); }
        else { requestFullscreen(e); }
    }

    return (
    <div class="video-player-bar">
        <div id="progress-bar"
            onmouseover={e => setScrub(calcScrub(e))}
            onmouseout={_ => setScrub(-1)}
            onmousemove={e => scrub >= 0 && setScrub(calcScrub(e))}
            onclick={e => setProgress(calcScrub(e))}
        >
            <div id="full-length" />
            <div id="scrub" style={`width: ${scrub * 100}%`}/>
            <div id="time" style={`width: ${progress * 100}%`}/>
        </div>
        <button id="play" class="icon">
            <i class="fa-sharp fa-solid fa-play"></i>
        </button>
        <button id="volume" class="icon">
            <i class="fa-solid fa-volume-xmark"></i>
        </button>
        <button
            id="fullscreen"
            class="icon"
            onclick={_ => toggleFullscreen(player.current)}
        >
            <i class={fullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand"}></i>
        </button>
    </div>);
};