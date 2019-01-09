import React from "react";
import classes from "./footer.css";

const footer = () => {
    return (
        <div className={classes.footer}>
            <div id="footerContainer" className={classes.footerContainer}>
                <div>
                    <div>
                        Want to learn more about QA process?<br></br> Contact:
                    </div>
                    <a href="https://github.com/sillicon">sillicon</a>
                </div>
                <div>
                    <div>
                        Want to learn more about this website?<br></br> Contact:
                    </div>
                    <a href="https://github.com/sillicon">sillicon</a>
                </div>
            </div>
        </div>
        
    )
}

export default footer;