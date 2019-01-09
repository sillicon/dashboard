import React from "react";
import classes from "./navi.css";

const navigation = (props) => {
    const envirs = ["Envir1", "Envir2", "Envir3"].map((ele) => {
        return (
            <a id={ele} key={ele} href={"#" + ele}
                onClick={() => {
                    props.switchEnvir(ele);
                }}
                className={props.envir === ele ? classes.naviActive : classes.naviInactive}>{ele}</a>
        )
    });

    return (
        <div id="navContainer" className={classes.naviContainer}>
            <div id="contentNavi" className={classes.contentNavi}>{envirs}</div>
            <div id="pageNavi" className={classes.pageNavi}>
                <a id="detailQuery" href="/ReadReport" target="_blank" className={classes.naviInactive}>Detail Query>></a>
                <a id="submitReport" href="/UploadReport" target="_blank" className={classes.naviInactive}>Upload Report>></a>
            </div>
        </div>
    )
}

export default navigation;