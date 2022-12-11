import { FilterBar } from '../components/filters';
import { NavigationBar } from '../components/topbar';
import { VideoRecommendations } from '../components/video';
import './watch.css';
import '../components/button.css';

import xwing from "../../www/assets/videos/xwing.json";
import { useEffect, useState } from 'preact/hooks';

export const Watch = ({id}) => {
    const [meta, setMeta] = useState({});

    useEffect(() => {
        fetch(`assets/videos/${id}.json`)
            .then(res => res.json())
            .then(json => setMeta(json));
    }, []);

    return (
    <>
        <div id="top-bar">
            <NavigationBar/>
        </div>
        <div id="columns">
            <div id="left">
                <div id="video">

                </div>
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
            </div>
            <div id="right">
                <FilterBar options={["All", "Web", "Games", "Microcontrollers", "3D Models", "Computer Graphics"]} selected="All"/>
                <VideoRecommendations videos={new Array(10).fill(xwing)}/>
            </div>
        </div>
    </>);
};