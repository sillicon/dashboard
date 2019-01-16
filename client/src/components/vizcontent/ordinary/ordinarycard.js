import React, {
    Component
} from "react";
import * as Promise from "bluebird";
import CardHolder from "./cardHolder";
import classes from "./ordinarycard.module.css";

const plusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" className="plus">
    <path d="M15 17H9v6H7v-6H1v-2h6V9h2v6h6v2z"></path>
</svg>;
const minusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" className="minus">
    <path d="M15 17H1v-2h14v2z"></path>
</svg>;
const dotSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" className="dot">
    <circle cx="8" cy="16" r="4"></circle>
</svg>;
const reportSVG = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="report">
    <path d="M22 24h4v2h-4v-2zm0-12h4v2h-4v-2zm0 4h4v2h-4v-2zM8 6h10v2H8V6zm14 14h4v2h-4v-2zM8 12h10v2H8v-2zm0 4h12v2H8v-2zM22.801 0H4v32h26V7.199L22.801 0zM28 30H6V2h14v8h8v20zm0-22h-6V2h.621L28 7.379V8zM8 20h12v2H8v-2zm0 4h10v2H8v-2z"/>
</svg>;

class Ordinarycard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        }
        if (props.reports.hasOwnProperty("testName") && props.reports.testName === "QA Category") {
            this.state.isOpen = true;
        }
        const {isOpen} = this.state;
        if (props.reports.hasOwnProperty("child")) {
            this.state.transArr = new Array(props.reports.child.length).fill(isOpen);
        }
    }

    componentWillMount() {
		// if (this.props.reports) {
        //     const button = <button
        //         className={this.props.reports.hasOwnProperty("child") ? classes.haschild : classes.nochild}>{
        //             this.props.hasOwnProperty("child") ? (this.state.isOpen ? minusSVG : plusSVG) : dotSVG
        //         }
        //     </button>
        //     const nameCard = <div className={classes.nameCard}></div>
        //     const cardHolder = <div>

        //     </div>
        //     this.container = <div className={classes.ordinaryCard}>
        //         {button}{nameCard}{cardHolder}
        //     </div>
        // } else {
        //     this.container = <div>Loading</div>
        // }
    }
    
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.reports !== this.props.reports || nextState !== this.state) {
    //         return true;
    //     }
    //     return false;
    // }

    // componentWillUpdate(nextProps, nextState) {
    //     if (nextProps.reports) {
    //         this.container = this.updateContainer(nextProps, nextState);
    //     }
    // }

    toggleCardHolder = () => {
        const {isOpen} = this.state;
        this.setState({isOpen: !isOpen});
        if (this.state.hasOwnProperty("transArr")) {
            const promiseList = [];
            for (let i = 0; i < this.props.reports.child.length; i++) {
                promiseList.push(this.switchVisibility);
            }
            Promise.reduce(promiseList, (result, currentFunction, index) => {
                return currentFunction(index);
            }, null);
        }
    }

    switchVisibility = (i) => {
        const newArr = [...this.state.transArr], interval = Math.min(80, Math.max(200 / newArr.length, 10));
        return Promise.delay(i === 0 ? 0 : interval).then(() => {
            if (this.state.isOpen) {
                newArr[i] = !newArr[i];
            } else {
                let length = newArr.length - 1;
                newArr[length - i] = !newArr[length - i];
            }
            this.setState({transArr: [...newArr]});
        });
    }

    render() {
        const passBtn={border: "5px solid rgb(102, 220, 102)"}, failBtn={border: "5px solid rgb(255, 178, 178)"};
        const button = <button
            className={this.props.reports.hasOwnProperty("child") ? classes.haschild : classes.nochild}
            style={this.props.reports.hasOwnProperty("testResult") ? (this.props.reports.testResult === "Pass" ? passBtn : failBtn) : null}
            onClick={this.toggleCardHolder.bind(this)}>{
                this.props.reports.hasOwnProperty("cateName") ? reportSVG : (this.props.reports.hasOwnProperty("child") ? (this.state.isOpen ? minusSVG : plusSVG) : dotSVG)
            }
        </button>
        const passColor={backgroundColor: "rgb(222,255,222"}, failColor={backgroundColor:"rgb(255,231,231)"};
        let newStyle = this.props.reports.hasOwnProperty("testResult") ? (this.props.reports.testResult === "Pass" ? passColor : failColor) : null;
        const nameCard = <div className={classes.nameCard} style={newStyle} >
            <div className={classes.fieldTitle}>{this.props.reports.hasOwnProperty("cateName") ? <a href={"./report/" + this.props.reports.testName}>{this.props.reports.testName}</a> : this.props.reports.testName}</div>
        </div>
        const {reports, className, ...rest} = this.props;
        return <div className={className ? className + " " + classes.ordinaryCard: classes.ordinaryCard} {...rest}>
            {button}{nameCard}<CardHolder reports={this.props.reports} isOpen={this.state.isOpen} transArr={this.state.transArr}></CardHolder>
        </div>
    }
}

export default Ordinarycard;