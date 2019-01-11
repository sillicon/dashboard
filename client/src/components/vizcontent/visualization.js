import React from "react";
import {Loader} from "semantic-ui-react";
import classes from "./visualization.module.css";
import OrdinaryCard from "./ordinary/ordinarycard";

const visualize = (props) => {
    let visualizeBlock;
    if (props.curViz === "Ordinary") {
        visualizeBlock = props.reports && !props.isLoading ? <OrdinaryCard reports={props.reports}></OrdinaryCard> :
            <Loader active inline="centered" size="massive"
                style={{transform:"translateY(90%)"}}>Loading</Loader>
    }

    return (
        <div id="vizPane" className={classes.vizPane}>{visualizeBlock}</div>
    )
}

export default visualize;