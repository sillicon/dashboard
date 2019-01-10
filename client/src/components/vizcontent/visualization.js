import React from "react";
import {Loader} from "semantic-ui-react";
import classes from "./visualization.css";
import OrdinaryCard from "./ordinary/ordinarycard";

const visualize = (props) => {
    let visualizeBlock;
    if (props.curViz === "Ordinary") {
        visualizeBlock = props.reports ? <OrdinaryCard reports={props.reports}></OrdinaryCard> : <Loader active inline="centered" size="massive"></Loader>
    }

    return (
        <div id="vizPane" className={classes.vizPane}>{visualizeBlock}</div>
    )
}

export default visualize;