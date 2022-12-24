import { useEffect, useState } from 'preact/hooks';
import { Video } from '../model/video';
import { channels } from '../../www/assets/channels.json';
import './video.css';

export const VideoCard = ({id, compact=false, filter}) => {
    const [hadHover, setHadHover] = useState(false);
    const [meta, setMeta] = useState({});

    useEffect(() => Video.load(id).then(setMeta), []);
    
    return (
    <a
        href={`/watch/${meta['id']}`}
        class={`video-card ${compact && "compact"}`}
        style={meta['filters']?.includes(filter) ? "" : "display: none"}
    >
        <div id="thumbnail" onMouseEnter={() => setHadHover(true)}>
            {hadHover && (
                <video autoplay loop muted>
                    <source src={`assets/videos/previews/${id}.mp4`}/>
                </video>
            )}
            <img src={`assets/videos/thumbnails/${id}.jpg`}/>
        </div>
        <div id="description">
            {!compact && (
                <img id="channel-icon" src={channels[meta['channel']]}/>
            )}
            <div id="column">
                <div id="title">
                    {meta['title'] ?? "..."}
                </div>
                <div id="channel">
                    {meta['channel']}
                </div>
                <div id="stats">
                    {meta['views'] ?? "..."} views · {meta['date'] ?? ""}
                </div>
            </div>
        </div>
    </a>
    );
};

export const VideoFeed = ({videos, filter, ...props}) => (
    <div class="video-feed" {...props}>
        {videos.map(v => <VideoCard filter={filter} id={v}/>)}
    </div>
);

export const VideoRecommendations = ({videos, filter}) => (
    <div class="video-recomendations">
        {videos.map(v => <VideoCard filter={filter} id={v} compact/>)}
    </div>
);