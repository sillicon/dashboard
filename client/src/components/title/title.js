import React from "react";
import { Route } from "react-router-dom";
import classes from "./title.module.css";
import Navi from "../navigation/navi";
import DatePicker from "../datepicker/datepicker";

const title = (props) => {
    const inlineStyle1 = {
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
    const detaultTitle = () => {
        return <div style={inlineStyle1}>
            <div id="envirName" className={classes.envirName}>{props.envir}</div>
            <div style={inlineStyle2}> on day: </div>
            <DatePicker curDate={props.curDate} dayChanged={props.queryChange} position={"title"} disabledDate={new Date()}></DatePicker>
        </div>
    }
    const queryTitle = () => {
        return <div style={inlineStyle1}>
            <div className={classes.envirName}>Query Report</div>
        </div>
    }
    const uploadTitle = () => {
        return <div style={inlineStyle1}>
            <div className={classes.envirName}>Upload Report</div>
        </div>
    }

    return (
        <div id="contentTitle" className={classes.contentTitle}>
            <Route exact path="/" component={detaultTitle}></Route>
            <Route exact path="/queryReport" component={queryTitle}></Route>
            <Route exact path="/uploadReport" component={uploadTitle}></Route>
            <Navi switchEnvir={props.switchEnvir} envir={props.envir}></Navi>
        </div>
    )
}

export default title;