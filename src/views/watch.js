import { FilterBar } from '../components/filters';
import { NavigationBar } from '../components/topbar';
import { VideoRecommendations } from '../components/video';
import { Video } from '../model/video';
import { videos } from "../../www/assets/videos/videos.json";
import './watch.css';
import '../components/button.css';

import { useEffect, useState } from "preact/hooks";
import { VideoPlayer } from '../components/player';

export const Watch = ({id}) => {
    const [meta, setMeta] = useState({});
    const [filter, setFilter] = useState("All");

    useEffect(() => Video.load(id).then(setMeta), [id]);

    return (
    <>
        <div id="top-bar">
            <NavigationBar/>
        </div>
        <div id="columns">
            <div id="left">
                <VideoPlayer id="video" meta={meta}/>
                <div id="title">
                    {meta['title']}
                </div>
                <div id="video-meta">
                    <img id="channel-icon" src="assets/icon.png"/>
                    <div id="channel-meta">
                        <div id="name">
                            {meta['channel']}
                        </div>
                        <div id="subscribers">
                            139k subscribers
                        </div>
                    </div>
                    <button id="subscribe-button" class="touch-button">
                        Subscribed
                    </button>
                    <div id="skills">
                        {meta['tags']?.map(tag => (
                            <button class="touch-button">
                                {tag}
                                <div id="tooltip">
                                    This project uses {tag}
                                </div>
                            </button>
                        ))}
                        <button
                            class="touch-button"
                            onclick={() => navigator.share({
                                title: meta['title'],
                                text: "Yohan Guyomard's portfolio.",
                                url: window.location.href
                            })}
                        >
                            <i class="fa-solid fa-share"></i>
                            &nbsp;Share
                            <div id="tooltip">
                                Share
                            </div>
                        </button>
                    </div>
                </div>
                <Description id="description" meta={meta}/>
            </div>
            <div id="right">
                <FilterBar
                    id="filter-bar"
                    options={["All", "Web", "Games", "Microcontrollers", "3D Models", "Computer Graphics"]}
                    selected={filter}
                    onSelect={setFilter}
                />
                <VideoRecommendations filter={filter} videos={videos}/>
            </div>
        </div>
    </>);
};

export const Description = ({meta, ...props}) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
    <div
        class={`${collapsed && "collapsed"} touch-button`}
        style={!collapsed && "pointer-events: none"}
        onclick={_ => collapsed && setCollapsed(false)}
        {...props}
    >
        <div id="inner">
            <b id="meta">{meta['views']} views · {meta['date']}</b>
            <br/>
            {meta['description']}
        </div>
        <b style="cursor: pointer; pointer-events: auto;" onclick={e => {
            setCollapsed(!collapsed);
            e.stopPropagation();
        }}>
            Show {collapsed ? "more" : "less"}
        </b>
    </div>
    )
};