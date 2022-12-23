import { useState, useRef, useEffect } from "preact/hooks";
import "./player.css";

export const VideoPlayer = ({meta, ...props}) => {
    const player = useRef();
    const video = useRef();

    const [paused, setPaused] = useState(false);
    const togglePause = () => {
        if (paused) {
            video.current?.play();
        } else {
            video.current?.pause();
        }
        setPaused(!paused);
    };

    return (
    <div
        class="video-player"
        ref={player}
        onclick={_ => togglePause()}
        {...props}
    >
        <VideoPlayerBar
            player={player}
            video={video}
            paused={paused}
            onSetTime={(t) => video.current.currentTime = t * video.current.duration}
            onTogglePause={togglePause}
        />
        <video src={meta['video'] ?? ""} ref={video} autoplay loop muted/>
    </div>);
};

export const VideoPlayerBar = ({ player, video, paused, onSetTime, onTogglePause }) => {
    const [fullscreen, setFullscreen] = useState(false);
    const [time, setTime] = useState(0);
    const [scrub, setScrub] = useState(-1);
    
    const calcScrub = e => e.offsetX / e.currentTarget.offsetWidth;
    
    useEffect(() => {
        video.current?.addEventListener('timeupdate', () => {
            setTime(video.current.currentTime / video.current.duration);
        });
    }, [video])

    return (
    <div class="video-player-bar">
        <div id="progress-bar"
            onmouseover={e => setScrub(calcScrub(e))}
            onmouseout={_ => setScrub(-1)}
            onmousemove={e => scrub >= 0 && setScrub(calcScrub(e))}
            onclick={e => {
                setTime(calcScrub(e));
                onSetTime(calcScrub(e));
                e.stopPropagation();
            }}
        >
            <div id="full-length" />
            <div id="scrub" style={`width: ${scrub * 100}%`}/>
            <div id="time" style={`width: ${time * 100}%`}/>
        </div>
        <button id="play" class="icon" onclick={_ => onTogglePause()}>
            <i class={`fa-sharp fa-solid fa-${paused ? "play" : "pause"}`}></i>
        </button>
        <button id="volume" class="icon">
            <i class="fa-solid fa-volume-xmark"></i>
        </button>
        <button
            id="fullscreen"
            class="icon"
            onclick={e => {
                if (fullscreen) { exitFullscreen(player.current); }
                else { requestFullscreen(player.current); }
                setFullscreen(!fullscreen);
                e.stopPropagation();
            }}
        >
            <i class={fullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand"}></i>
        </button>
    </div>);
};

// Polyfill
const requestFullscreen = (e) => {
    if (e.requestFullscreen) { e.requestFullscreen(); }
    else if (e.webkitRequestFullscreen) { e.webkitRequestFullscreen(); }
    else if (e.msRequestFullscreen) { e.msRequestFullscreen(); }
};
const exitFullscreen = (e) => {
    if (e.exitFullscreen) { e.exitFullscreen(); }
    else if (e.webkitExitFullscreen) { e.webkitExitFullscreen(); }
    else if (e.msExitFullscreen) { e.msExitFullscreen(); }
};