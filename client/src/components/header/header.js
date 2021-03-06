import React from "react";
import classes from "./header.module.css";

const header = (props) => {
    const userInfo = props.userInfo;

    return (
        <header className={classes.siteHeader}>
            <div id="siteHeader" className={classes.siteHeaderCenter}>
                <img 
                    id="sampleLogo" alt="Logo"
                    src={require("../../image/sampleLogo.png")}
                    className={classes.logo}></img>
                <div id="siteName" className={classes.siteName}>Sample QA Dashboard</div>
                <div id="loginGithub"
                    className={classes.loginGithub}
                    onClick={userInfo ? props.checkProfile : props.gitLogin}>
                    <img
                        id="headerGitLogo" alt="GitHubLogo"
                        src={userInfo ? userInfo.photos[0].value : require("../../image/github.svg")}
                        className={classes.GitLogo}></img>
                    <div id="loginLabel" className={classes.loginLabel}>{userInfo ? userInfo.username : "GitHub Login"}</div>
                </div>
            </div>
        </header>
    )
}

export default header;