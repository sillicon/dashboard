import React from "react";
import classes from "./buttons.css";

const buttons = (props) => {
    const vizArr = ["Sunburst", "Circle Pack", "Treemap", "Tree", "Ordinary"].map((ele) => {
        return (
            <div
                id={ele.replace(/ /g, "")+"View"}
                key={ele.replace(/ /g, "")}
                className={props.curViz === ele ? classes.buttonSelected : ""}
                onClick={props.changeViz}>{ele}</div>
        )
    });

    return (
        <div id="buttonContainer" className={classes.buttonContainer}>
            <div className={classes.buttonGroup1}>
                <div id="summary">Summary</div>
            </div>
            <div className={classes.buttonGroup2}>
                <div id="categoryView" className={props.isCategoryView ? classes.buttonSelected : ""}>Category View</div>
                <div id="cardView" className={props.isCategoryView ? "" : classes.buttonSelected}>Detail Card View</div>
            </div>
            <div className={classes.buttonGroup3}>{vizArr}</div>
        </div>
    )
}

export default buttons;