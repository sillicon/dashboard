import React from "react";
import classes from "./content.css";
import Title from "../components/title/title";
import Buttons from "../components/vizbuttons/buttons";
import Visualization from "../components/vizcontent/visualization";

const content = (props) => {
    return (
        <div className={classes.content}>
            <Title envir={props.envir}
                curDate={props.curDate}
                queryChange={props.queryChange}
                switchEnvir={props.switchEnvir}></Title>
            <Buttons curViz={props.curViz}
                isCategoryView={props.isCategoryView}></Buttons>
            <Visualization curViz={props.curViz}
                isCategoryView={props.isCategoryView}
                reports={props.reports}></Visualization>
        </div>
    )
}

export default content;