import { useState } from 'preact/hooks';
import './video.css';

export const VideoCard = ({meta, compact=false}) => {
    const [hadHover, setHadHover] = useState(false);
    
    return (
    <a href={`/watch/${meta['id']}`} class={`video-card ${compact && "compact"}`}>
        <div id="thumbnail" onMouseEnter={() => setHadHover(true)}>
            {hadHover && (
                <video autoplay loop muted>
                    <source src={meta['preview']}/>
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
                    {meta['title']}
                </div>
                <div id="channel">
                    Pewdiepie
                </div>
                <div id="stats">
                    2.6M views · {meta['date']}
                </div>
            </div>
        </div>
    </a>
    );
};

export const VideoFeed = ({videos}) => (
    <div class="video-feed">
        {videos.map(v => <VideoCard meta={v}/>)}
    </div>
);

export const VideoRecommendations = ({videos}) => (
    <div class="video-recomendations">
        {videos.map(v => <VideoCard meta={v} compact/>)}
    </div>
);