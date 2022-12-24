import { FilterBar } from "../components/filters";
import { LinksBar } from "../components/sidebar";
import { NavigationBar } from "../components/topbar";
import { VideoFeed } from "../components/video";
import { videos } from "../../www/assets/videos/videos.json";
import './home.css';
import { useState } from "preact/hooks";

export const Home = () => {
    const [filter, setFilter] = useState("All");

    return (
    <>
        <NavigationBar id="nav-bar"/>
        <LinksBar id="links-bar"/>
        <FilterBar
            id="filter-bar"
            options={["All", "Web", "Games", "Microcontrollers", "3D Models", "Computer Graphics"]}
            selected={filter}
            onSelect={setFilter}
        />
        <VideoFeed id="video-feed" videos={videos} filter={filter}/>
    </>);
};