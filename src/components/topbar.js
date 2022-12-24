import './topbar.css';

export const NavigationBar = (props) => (
    <div class="navigation-bar" {...props}>
        <div id="logo">
            <Logo/>
        </div>
        <div id="search-bar">
            {/* <SearchBar/> */}
        </div>
        <div id="icon">
            {/* <ProfileIcon/> */}
        </div>
    </div>
);

export const SearchBar = () => (
    <form id="search-form" class="search-bar">
        <div id="container">
            <input type="text" id="query" name="query"/>
            <button type="submit" id="search">
                <i class="fa-sharp fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
    </form>
);

export const ProfileIcon = () => (
    <div class="profile-icon">
        <img src="assets/icon.png"/>
    </div>
);

export const Logo = () => (
    <a class="logo" href="/">
        <img src="assets/logo.svg"/>
        Portfolio
    </a>
);