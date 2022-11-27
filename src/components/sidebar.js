import "./sidebar.css";

const GITHUB = "https://github.com/yohandev";
const LINKEDIN = "https://www.linkedin.com/in/yohan-guyomard-110363221/";
const EMAIL = "mailto:yohang@mit.edu";

export const LinksBar = () => (
    <div class="links-bar">
        <LinksBarIcon icon="fa-solid fa-folder" label="Projects" link="/" selected/>
        <LinksBarIcon icon="fa-brands fa-github" label="GitHub" link={GITHUB}/>
        <LinksBarIcon icon="fa-brands fa-linkedin" label="LinkedIn" link={LINKEDIN}/>
        <LinksBarIcon icon="fa-solid fa-envelope" label="Mail" link={EMAIL}/>
    </div>
);

export const LinksBarIcon = ({icon, label, link, selected=false}) => (
    <a href={link} class="links-bar-item">
        <div id="container" class={selected && "selected"}>
            <i class={icon} id="icon"></i>
            <span id="label">{label}</span>
        </div>
    </a>
);