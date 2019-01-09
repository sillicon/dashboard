import React, {
    Component
} from "react";
import classes from "./ordinarycard.css";

const plusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" className="plus">
    <path d="M15 17H9v6H7v-6H1v-2h6V9h2v6h6v2z"></path>
</svg>;
const minusSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" className="minus">
    <path d="M15 17H1v-2h14v2z"></path>
</svg>;
const dotSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 8 16 16" className="dot">
    <circle cx="8" cy="16" r="4"></circle>
</svg>;

class ordinarycard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isLoading: true
        }
    }

    container = <div>Loading</div>

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
        if (nextProps.reports && this.state.isLoading) {
            nextState.isLoading = false;
            return true;
        }
        return false;
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.reports) {
            const button = <button
                className={nextProps.reports.hasOwnProperty("child") ? classes.haschild : classes.nochild}>{
                    nextProps.reports.hasOwnProperty("child") ? (nextState.isOpen ? minusSVG : plusSVG) : dotSVG
                }
            </button>
            const nameCard = <div className={classes.nameCard}></div>
            const cardHolder = <div>
                
            </div>
            this.container = <div className={classes.ordinaryCard}>
                {button}{nameCard}{cardHolder}
            </div>
        }
    }

    render() {
        return this.container;
    }
}

export default ordinarycard;