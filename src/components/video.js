import { useState } from 'preact/hooks';
import './video.css';

export const VideoCard = ({meta}) => {
    const [hadHover, setHadHover] = useState(false);
    
    return (
    <div class="video-card">
        <div id="thumbnail" onMouseEnter={() => setHadHover(true)}>
            {hadHover && (
                <video autoplay loop muted>
                    <source src={meta['preview']}/>
                </video>
            )}
            <img src={meta['thumbnail'] ?? ""}/>
        </div>
        <div id="description">
            <span id="title">
                {meta['title']}
            </span>
            <span id="channel">
                Pewdiepie
            </span>
            <span id="stats">
                2.6M views · {meta['date']}
            </span>
        </div>
    </div>
    );
};

export const VideoFeed = ({videos}) => (
    <div class="video-feed">
        {videos.map(v => <VideoCard meta={v}/>)}
    </div>
)