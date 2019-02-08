import React from "react";
import { Route } from "react-router-dom";
import classes from "./content.module.css";
import Title from "../components/title/title";
import Buttons from "../components/vizbuttons/buttons";
import Visualization from "../components/vizcontent/visualization";
import QueryReport from "../components/query/queryReport";

const content = (props) => {
    const vizUI = () => {
        return (
            <>
                <Buttons curViz={props.curViz}
                    isCategoryView={props.isCategoryView}
                    reports={props.reports}
                    changeViz={props.changeViz}
                    summary={props.summary}
                    modalOpen={props.modalOpen}
                    modalClose={props.modalClose}
                    isModalOpen={props.isModalOpen}>
                </Buttons>
                <Visualization curViz={props.curViz}
                    isCategoryView={props.isCategoryView}
                    reports={props.reports}
                    isLoading={props.isLoading}
                    browserName={props.browserName}>
                </Visualization>
            </>
        )
    }
    const query = () => {
        return <QueryReport></QueryReport>
    }

    return (
        <div className={classes.content}>
            <Title envir={props.envir}
                curDate={props.curDate}
                queryChange={props.queryChange}
                switchEnvir={props.switchEnvir}></Title>
            <Route exact path="/" component={vizUI}></Route>
            <Route path="/queryReport" component={query}></Route>
            {/* <Buttons curViz={props.curViz}
                isCategoryView={props.isCategoryView}
                reports={props.reports}
                changeViz={props.changeViz}
                summary={props.summary}
                modalOpen={props.modalOpen}
                modalClose={props.modalClose}
                isModalOpen={props.isModalOpen}></Buttons>
            <Visualization curViz={props.curViz}
                isCategoryView={props.isCategoryView}
                reports={props.reports}
                isLoading={props.isLoading}
                browserName={props.browserName}></Visualization> */}
        </div>
    )
}

export default content;