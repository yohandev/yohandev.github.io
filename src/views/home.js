import { FilterBar } from "../components/filters";
import { LinksBar } from "../components/sidebar";
import { NavigationBar } from "../components/topbar";
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
            <FilterBar options={["All", "Web", "Games", "Microcontrollers"]} selected="All"/>
        </div>
        <div id="video-feed">
            
        </div>
    </>
);