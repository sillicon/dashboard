import React from "react";
import {Transition} from "semantic-ui-react";
import OrdinaryCard from "./ordinarycard";
import classes from "./ordinarycard.module.css";

const cardHolder = (props) => {
    let cardArr = null;
    if (props.reports.hasOwnProperty("child")) {
        cardArr = [];
        for (let i = 0; i < props.reports.child.length; i++) {
            const element = props.reports.child[i];
            cardArr.push(
                <Transition
                    key={element.testName}
                    duration={Math.min(1000 / props.transArr.length, 300)}
                    animation={"slide down"}
                    visible={props.transArr[i]}><OrdinaryCard reports={element}></OrdinaryCard></Transition>
            );
        }
    }
    const cardHolder = <div className={classes.cardHolder}>{cardArr}</div>;

    return (cardHolder)
}

export default cardHolder;