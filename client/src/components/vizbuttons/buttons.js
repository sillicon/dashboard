import React from "react";
import classes from "./buttons.module.css";

const buttons = (props) => {
    const vizArr = ["Sunburst", "Circle Pack", "Treemap", "Tree", "Ordinary"].map((ele) => {
        return (
            <div
                id={ele.replace(/ /g, "")+"View"}
                key={ele.replace(/ /g, "")}
                className={props.curViz === ele ? classes.buttonSelected : ""}
                onClick={props.changeViz.bind(this, ele)}>{ele}</div>
        )
    });
    return (
        <div id="buttonContainer" className={classes.buttonContainer}>
            <div className={classes.buttonGroup1}>
                <div id="summary">Summary</div>
            </div>
            <div className={classes.buttonGroup2}>
                <div id="categoryView" className={props.isCategoryView ? classes.buttonSelected : ""} onClick={props.changeViz.bind(this, "Category")}>Category View</div>
                <div id="cardView" className={props.isCategoryView ? "" : classes.buttonSelected} onClick={props.changeViz.bind(this, "DetailCard")}>Detail Card View</div>
            </div>
            <div className={classes.buttonGroup3}>{props.curViz !== "DetailCard" ? vizArr : null}</div>
        </div>
    )
}

export default buttons;