import { FilterBar } from '../components/filters';
import { NavigationBar } from '../components/topbar';
import { VideoRecommendations } from '../components/video';
import { Video } from '../model/video';
import './watch.css';
import '../components/button.css';

import { useEffect, useState } from "preact/hooks";
import { VideoPlayer } from '../components/player';

export const Watch = ({id}) => {
    const [meta, setMeta] = useState({});

    useEffect(() => Video.load(id).then(setMeta), []);

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
                        <button class="touch-button">
                            C#
                            <div id="tooltip">
                                This project uses C#
                            </div>
                        </button>
                        <button class="touch-button">
                            Unity
                            <div id="tooltip">
                                This project is made in Unity
                            </div>
                        </button>
                        <button class="touch-button">
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
                <FilterBar options={["All", "Web", "Games", "Microcontrollers", "3D Models", "Computer Graphics"]} selected="All"/>
                <VideoRecommendations videos={new Array(10).fill('ragdoll')}/>
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