import React from "react";
import classes from "./visualization.css";
import OrdinaryCard from "./ordinary/ordinarycard";

const visualize = (props) => {
    let visualizeBlock;
    if (props.curViz === "Ordinary") {
        return (
            <OrdinaryCard reports={props.reports}></OrdinaryCard>
        )
    }

    return (
        <div id="vizPane" className={classes.vizPane} reports={props.reports}>{visualizeBlock}</div>
    )
}

export default visualize;