import React from "react";
import classes from "./title.css";
import DatePicker from "react-datepicker";

const title = (props) => {
    let inlineStyle1 = {
            width: "80%",
            maxWidth: "1200px",
            margin: "auto"
        },
        inlineStyle2 = {
            display: "inline-block",
            position: "relative",
            color: "white",
            fontSize: "33px",
            margin: "auto 12px auto 12px"
        }
    return (
        <div id="contentTitle" className={classes.contentTitle}>
            <div style={inlineStyle1}>
                <div id="envirName">{props.envir}</div>
                <div style={inlineStyle2}> on: </div>
                <DatePicker
                    selected={props.curDate}
                    onchange={props.queryChange}
                    maxDate={new Date()}
                    todayButton={"Today"}></DatePicker>
            </div>
        </div>
    )
}

export default title;