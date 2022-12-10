import { FilterBar } from "../components/filters";
import { LinksBar } from "../components/sidebar";
import { NavigationBar } from "../components/topbar";
import { VideoFeed } from "../components/video";
import './home.css';

import xwing from "../../www/assets/videos/xwing.json"

export const Home = () => (
    <>
        <div id="top-bar">
            <NavigationBar/>
        </div>
        <div id="side-bar">
            <LinksBar/>
        </div>
        <div id="filter-bar">
            <FilterBar options={["All", "Web", "Games", "Microcontrollers", "3D Models", "Computer Graphics"]} selected="All"/>
        </div>
        <div id="video-feed">
            <VideoFeed videos={new Array(10).fill(xwing)}/>
        </div>
    </>
);