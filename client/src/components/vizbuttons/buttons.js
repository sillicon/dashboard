import React from "react";
import {
    Modal, TransitionablePortal
} from "semantic-ui-react";
import classes from "./buttons.module.css";
import Gauge from "./flowgauge";

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
    const gaugeArr = [0, 1, 2, 3].map((ele) => {
        if (props.summary) {
            if (ele < 3) {
                return <Gauge gaugeID={"TestCate" + ele} key={"TestCate" + ele}
                gaugeDesc={"Test Category " + ele + " coverage:"}
                gaugeInfo={props.summary[ele].testArea + " areas, " + props.summary[ele].coveredTestArea + " tested."}
                rate={props.summary[ele].testArea === 0 ? 0 : props.summary[ele].coveredTestArea / props.summary[ele].testArea}>
            </Gauge>
            } else {
                return <Gauge gaugeID="AllTestSum" key="AllTestSum"
                gaugeDesc={"Total tests pass rate:"}
                gaugeInfo={props.summary[ele].testCount + " tests, " + props.summary[ele].passCount + " passed."}
                rate={props.summary[ele].testCount === 0 ? 0 : props.summary[ele].passCount / props.summary[ele].testCount}>
            </Gauge>
            }
        } else {
            return null;
        }
    });
    return (
        <div id="buttonContainer" className={classes.buttonContainer}>
            <div className={classes.buttonGroup1}>
                <div id="summary" onClick={props.modalOpen}>Summary</div>
                <TransitionablePortal
                    open={props.isModalOpen}
                    transition={{ animation: "scale", duration: 300 }}>
                    <Modal open={true} closeIcon onClose={() => {
                        props.modalClose();
                    }}>
                        <Modal.Content style={{backgroundColor: "rgb(88,96,105)", textAlign: "center"}}>{gaugeArr}</Modal.Content>
                    </Modal>
                </TransitionablePortal>
            </div>
            <div className={classes.buttonGroup2}>
                <div id="categoryView" className={props.isCategoryView ? classes.buttonSelected : ""} onClick={props.changeViz.bind(this, "Category")}>
                    Category View
                </div>
                <div id="cardView"
                    className={props.isCategoryView ? "" : classes.buttonSelected}
                    onClick={props.changeViz.bind(this, "DetailCard")}>Detail Card View</div>
            </div>
            <div className={classes.buttonGroup3}>{props.curViz !== "DetailCard" ? vizArr : null}</div>
        </div>
)}

export default buttons;