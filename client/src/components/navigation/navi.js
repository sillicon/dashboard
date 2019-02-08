import React from "react";
import { Route, Link } from "react-router-dom";
import classes from "./navi.module.css";

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

    const envirNavi = () => {
        return <div id="contentNavi" className={classes.contentNavi}>{envirs}</div>
    }

    const otherNavi = () => {
        return <div id="contentNavi" className={classes.contentNavi}>
            <Link to="/" className={classes.naviInactive}>Back</Link>
        </div>
    }

    return (
        <div id="navContainer" className={classes.naviContainer}>
            <Route exact path="/" component={envirNavi}/>
            <Route path="/queryReport" component={otherNavi}/>
            <Route path="/uploadReport" component={otherNavi}/>
            <div id="pageNavi" className={classes.pageNavi}>
                {/* <a id="detailQuery" href="/queryReport" target="_blank" className={classes.naviInactive}>Detail Query>></a>
                <a id="submitReport" href="/UploadReport" target="_blank" className={classes.naviInactive}>Upload Report>></a> */}
                <Link to="/queryReport" className={classes.naviInactive}>Detail Query</Link>
                <Link to="/uploadReport" className={classes.naviInactive}>Upload Report</Link>
            </div>
        </div>
    )
}

export default navigation;