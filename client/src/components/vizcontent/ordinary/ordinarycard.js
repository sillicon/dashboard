import React, {
    Component
} from "react";
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
            isOpen: false
        }
        if (props.reports.hasOwnProperty("testName") && props.reports.testName === "QA Category") {
            this.state.isOpen = true;
        }
        // this.container = this.updateContainer(this.props, this.state);
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
    
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.reports !== this.props.reports || nextState !== this.state) {
            return true;
        }
        return false;
    }

    // componentWillUpdate(nextProps, nextState) {
    //     if (nextProps.reports) {
    //         this.container = this.updateContainer(nextProps, nextState);
    //     }
    // }

    toggleCardHolder = () => {
        const bool = this.state.isOpen;
        this.setState({isOpen: !bool});
    }

    // updateContainer = (nextProps, nextState) => {
    //     const button = <button
    //         className={nextProps.reports.hasOwnProperty("child") ? classes.haschild : classes.nochild}
    //         onClick={this.toggleCardHolder}>{
    //             nextProps.reports.hasOwnProperty("cateName") ? reportSVG : (nextProps.reports.hasOwnProperty("child") ? (nextState.isOpen ? minusSVG : plusSVG) : dotSVG)
    //         }
    //     </button>
    //     const nameCard = <div className={classes.nameCard}>
    //         <div className={classes.fieldTitle}>{nextProps.reports.testName}</div>
    //     </div>
    //     let cardArr = null;
    //     if (nextProps.reports.hasOwnProperty("child")) {
    //         cardArr = nextProps.reports.child.map((ele) => {
    //             return new ordinarycard({reports: ele}).render();
    //         });
    //     }
    //     const cardHolder = this.state.isOpen ? <div className={classes.cardHolder}>{cardArr}</div> : null;
    //     return <div className={classes.ordinaryCard} key={nextProps.reports.testName}>
    //         {button}{nameCard}{cardHolder}
    //     </div>
    // }

    render() {
        // return this.container;
        const button = <button
            className={this.props.reports.hasOwnProperty("child") ? classes.haschild : classes.nochild}
            onClick={this.toggleCardHolder.bind(this)}>{
                this.props.reports.hasOwnProperty("cateName") ? reportSVG : (this.props.reports.hasOwnProperty("child") ? (this.state.isOpen ? minusSVG : plusSVG) : dotSVG)
            }
        </button>
        const nameCard = <div className={classes.nameCard}>
            <div className={classes.fieldTitle}>{this.props.reports.testName}</div>
        </div>
        
        return <div className={classes.ordinaryCard} key={this.props.reports.testName}>
            {button}{nameCard}<CardHolder reports={this.props.reports} isOpen={this.state.isOpen}></CardHolder>
        </div>
    }

    // state={
    //     isOpen: true
    // }

    // toggleDiv = () => {
    //     this.setState({
    //         isOpen: !this.state.isOpen
    //     })
    // }

    // render() {
    //     const button = <button onClick={this.toggleDiv}>Toggle</button>
    //     const divs=["dfasdfadf", "asdfasdfds", "sfadsf"];
    //     const arr = [];
    //     for (let i = 0; i < divs.length; i++) {
    //         const element = divs[i];
    //         arr.push(<Transition animation="slide down" duration={400} visible={this.state.isOpen}>
    //             <div>{element}</div>
    //         </Transition>)
    //     }
        
    //     return (
    //         <div>{button}
    //             {arr}
    //         </div>
    //     )
    // }

}

export default Ordinarycard;