import { FilterBar } from "../components/filters";
import { LinksBar } from "../components/sidebar";
import { NavigationBar } from "../components/topbar";
import { VideoFeed } from "../components/video";
import { videos } from "../../www/assets/videos/videos.json";
import './home.css';

export const Home = () => (
    <>
        <NavigationBar/>
        <FilterBar options={["All", "Web", "Games", "Microcontrollers", "3D Models", "Computer Graphics"]} selected="All"/>
        <VideoFeed videos={videos}/>
    </>
);