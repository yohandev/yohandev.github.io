import { FilterBar } from "../components/filters";
import { LinksBar } from "../components/sidebar";
import { NavigationBar } from "../components/topbar";
import { VideoFeed } from "../components/video";
import { videos } from "../../www/assets/videos/videos.json";
import './home.css';

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
            <VideoFeed videos={videos}/>
        </div>
    </>
);