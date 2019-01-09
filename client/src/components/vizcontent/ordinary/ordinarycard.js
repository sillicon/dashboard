import React, {
    Component
} from "react";
import classes from "./ordinarycard.css";

const plusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" class="plus">
    <path d="M15 17H9v6H7v-6H1v-2h6V9h2v6h6v2z"></path>
</svg>;
const minusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" class="minus">
    <path d="M15 17H1v-2h14v2z"></path>
</svg>;
const dotSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" class="dot">
    <circle cx="8" cy="16" r="4"></circle>
</svg>;

class ordinarycard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }    

    button = <button
        className={this.props.reports.hasOwnProperty("child") ? classes.haschild : classes.nochild}>{
            this.props.hasOwnProperty("child") ? (this.state.isOpen ? minusSVG : plusSVG) : dotSVG
        }
    </button>

    render() {
        return (
            <div className={classes.ordinaryCard}>
                {this.button}
                <div className={classes.nameCard}></div>
                <div className={classes.cardHolder}></div>
            </div>
        )
    }
}

export default ordinarycard;