import { useEffect, useState } from 'preact/hooks';
import { Video } from '../model/video';
import './video.css';

export const VideoCard = ({id, compact=false}) => {
    const [hadHover, setHadHover] = useState(false);
    const [meta, setMeta] = useState({});

    useEffect(() => Video.load(id).then(setMeta), []);
    
    return (
    <a href={`/watch/${meta['id']}`} class={`video-card ${compact && "compact"}`}>
        <div id="thumbnail" onMouseEnter={() => setHadHover(true)}>
            {hadHover && (
                <video autoplay loop muted>
                    <source src={meta['preview'] ?? ""}/>
                </video>
            )}
            <img src={meta['thumbnail'] ?? ""}/>
        </div>
        <div id="description">
            {!compact && (
                <img id="channel-icon" src="assets/icon.png"/>
            )}
            <div id="column">
                <div id="title">
                    {meta['title'] ?? "..."}
                </div>
                <div id="channel">
                    Pewdiepie
                </div>
                <div id="stats">
                    {meta['views'] ?? "..."} views · {meta['date'] ?? ""}
                </div>
            </div>
        </div>
    </a>
    );
};

export const VideoFeed = ({videos}) => (
    <div class="video-feed">
        {videos.map(v => <VideoCard id={v}/>)}
    </div>
);

export const VideoRecommendations = ({videos}) => (
    <div class="video-recomendations">
        {videos.map(v => <VideoCard id={v} compact/>)}
    </div>
);