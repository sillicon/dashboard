import React from "react";
import {Loader} from "semantic-ui-react";
import classes from "./visualization.module.css";
import OrdinaryCard from "./ordinary/ordinarycard";
import Tree from "./tree/tree";
import TreeMap from "./treemap/treemap";
import CirclePack from "./circlepack/circlepack";
import Sunburst from "./sunburst/sunburst";
import DetailCard from "./detailcard/detailcard";

const visualize = (props) => {
    let visualizeBlock;
    if (props.isLoading) {
        visualizeBlock = <Loader active inline="centered" size="massive" style={{transform:"translateY(90%)"}}>Loading</Loader>
    } else {
        if (props.curViz === "Ordinary") {
            visualizeBlock = <OrdinaryCard reports={props.reports}></OrdinaryCard>
        } else if (props.curViz === "Tree") {
            visualizeBlock = <Tree reports={props.reports}></Tree>
        } else if (props.curViz === "Treemap") {
            visualizeBlock = <TreeMap reports={props.reports}></TreeMap>
        } else if (props.curViz === "Circle Pack") {
            visualizeBlock = <CirclePack reports={props.reports}></CirclePack>
        } else if (props.curViz === "Sunburst") {
            visualizeBlock = <Sunburst reports={props.reports}></Sunburst>
        } else if (props.curViz === "DetailCard") {
            visualizeBlock = <DetailCard reports={props.reports} browserName={props.browserName}></DetailCard>
        }
    }
    

    return (
        <div id="vizPane" className={classes.vizPane}>{visualizeBlock}</div>
    )
}

export default visualize;