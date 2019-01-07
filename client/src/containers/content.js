import React from "react";
import classes from "./content.css";
import Title from "../components/title/title";

const content = (props) => {
    return (
        <div className={classes.content}>
            <Title envir={props.envir}
                curDate={props.curDate}
                queryChange={props.queryChange}></Title>
        </div>
    )
}

export default content;