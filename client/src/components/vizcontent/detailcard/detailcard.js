import React, {
    Component
} from "react";
import * as d3 from "d3";
import "./detailcard.css";
import classes from "./detailcard.module.css";

class Gauge extends Component {
    componentDidMount() {
        this.drawGauge();
    }

    drawGauge = () => {
        const margin = {
                top: 50,
                right: 10,
                bottom: 50,
                left: 10
            },
            svgWidth = 200,
            svgHeight = 200,
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom,
            obj = this.props.obj,
            totalTest = obj.child.length,
            passCount = obj.passCount;
        let svg = d3.select("#" + obj.testName.replace(/ /g, "")).append("svg").attr("style", "width: " + svgWidth + "px; height: " + svgHeight + "px;");
        if (totalTest !== 0) {
            let percent = passCount / totalTest;
            let resultText = svg.append("text").text(null);
            resultText.attr("x", svgWidth / 2)
                .attr("y", svgHeight / 2 + 10)
                .attr("font-size", "40px")
                .attr("fill", "#b6b6b6")
                .attr("font-weight", "bold")
                .text(function() {
                    if (passCount < totalTest) {
                        return totalTest - passCount;
                    }
                    return passCount;
                });
            let strWidth = resultText.node().getComputedTextLength();
            resultText.attr("x", svgWidth / 2 - strWidth / 2);
            let resultLabel = svg.append("text").text(null);
            resultLabel.attr("x", svgWidth / 2)
                .attr("y", svgHeight / 2 + 70)
                .attr("font-size", "1.5rem")
                .attr("fill", "#b6b6b6")
                .text(function() {
                    if (passCount < totalTest) {
                        return "Fail";
                    }
                    return "Pass";
                });
            let strWidth2 = resultLabel.node().getComputedTextLength();
            resultLabel.attr("x", svgWidth / 2 - strWidth2 / 2);
            let successArc = svg.data(function() {
                return [obj.child.filter((ele) => {
                    return ele.testResult === "Pass";
                }).map((ele) => {
                    return ele.hasOwnProperty("reportURL") ? ele.reportURL : ele.fileName;
                })];
            }).append("path").attr("class", "successArc")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
            let failArc = svg.data(function() {
                return [obj.child.filter((ele) => {
                    return ele.testResult === "Fail";
                }).map((ele) => {
                    return ele.hasOwnProperty("reportURL") ? ele.reportURL : ele.fileName;
                })];
            }).append("path")
                .attr("class", "failArc")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
            let arc1 = d3.arc()
                .innerRadius(width / 2 - 30)
                .outerRadius(width / 2)
                .startAngle(-Math.PI * 3 / 4);
            let arc2 = d3.arc()
                .innerRadius(width / 2 - 30)
                .outerRadius(width / 2)
                .startAngle(-Math.PI * 3 / 4 + percent * Math.PI * 3 / 2);
            let temp1 = 0,
                temp2 = 0;
            let timer = setInterval(function() {
                if (temp1 < percent * 100) {
                    arc1.endAngle(-Math.PI * 3 / 4 + temp1 / 100 * Math.PI * 3 / 2);
                    successArc.attr("d", arc1);
                    temp1++;
                } else if (temp1 >= percent * 100 && temp2 === 0) {
                    arc1.endAngle(-Math.PI * 3 / 4 + percent * Math.PI * 3 / 2);
                    successArc.attr("d", arc1);
                    arc2.endAngle(-Math.PI * 3 / 4 + (percent + temp2 / 100) * Math.PI * 3 / 2);
                    failArc.attr("d", arc2);
                    temp2++;
                } else if (temp1 + temp2 < 100) {
                    arc2.endAngle(-Math.PI * 3 / 4 + (percent + temp2 / 100) * Math.PI * 3 / 2);
                    failArc.attr("d", arc2);
                    temp2++;
                } else if (temp1 + temp2 === 100) {
                    arc2.endAngle(Math.PI * 3 / 4);
                    failArc.attr("d", arc2);
                    clearInterval(timer);
                }
            }, 10);
            bindMouseBehavior(successArc, arc1);
            bindMouseBehavior(failArc, arc2);
        } else {
            let percentText = svg.append("text").text(null);
            percentText.attr("x", svgWidth / 2)
                .attr("y", svgHeight / 2 + 70)
                .attr("font-size", "1.5rem")
                .attr("fill", "#b6b6b6")
                .text("Not Run");
            let strWidth = percentText.node().getComputedTextLength();
            percentText.attr("x", svgWidth / 2 - strWidth / 2);
            let noneArc = svg.append("path")
                .attr("class", "noneArc")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
            let arc = d3.arc()
                .innerRadius(width / 2 - 30)
                .outerRadius(width / 2)
                .startAngle(-Math.PI * 3 / 4)
                .endAngle(Math.PI * 3 / 4);
            let temp = 0;
            let timer = setInterval(function() {
                if (temp < 100) {
                    arc.endAngle(-Math.PI * 3 / 4 + temp / 100 * Math.PI * 3 / 2);
                    noneArc.attr("d", arc);
                    temp++;
                } else {
                    arc.endAngle(Math.PI * 3 / 4);
                    noneArc.attr("d", arc);
                    clearInterval(timer);
                }
            }, 10);
        }

        function bindMouseBehavior(arcElement, arc) {
            arcElement.on("mouseover", function() {
                arc.outerRadius(width / 2 + 5);
                arcElement.attr("d", arc);
            }).on("mouseout", function() {
                arc.outerRadius(width / 2);
                arcElement.attr("d", arc);
            }).on("click", function(d) {
                let div = d3.select("#reportList");
                let tempScg = svg._groups[0][0];
                let pos = d3.mouse(tempScg);
                div.html(function() {
                    let tempHTML = "";
                    for (let i = 0; i < d.length; i++) {
                        const url = d[i];
                        if (url.indexOf("http") > -1) {
                            tempHTML += "<span><a href='" + url + "' target='_blank'>Click here for report</a></span><br>";
                        } else {
                            tempHTML += "<span><a href='.\\report\\" + url + "' target='_blank'>" + url + "</a></span><br>";
                        }
                    }
                    return tempHTML;
                });
                div.style("display", "block");
                div.style("left", function() {
                    let arcLeft = tempScg.getBoundingClientRect().left, scrollWidth;
                    scrollWidth = document.getElementsByTagName("html")[0].scrollLeft;
                    return ((arcLeft + pos[0] + scrollWidth + 15) + "px");
                });
                div.style("top", function() {
                    let arctTop = tempScg.getBoundingClientRect().top,
                        tipHeight = this.getBoundingClientRect().height, scrollHeight;
                        scrollHeight = document.getElementsByTagName("html")[0].scrollTop;
                    return ((arctTop + pos[1] + scrollHeight - tipHeight / 2) + "px");
                });
            });

        }
    }

    render() {
        return <div id={this.props.obj.testName.replace(/ /g, "")}></div>
    }
}

const detailCard = (props) => {
    const divArr = props.reports.map((obj) => {
        const title = <div className={classes.fieldTitle}>{obj.testName}</div>
        const desc = <div>{"Total test run for today: " + obj.child.length}</div>
        const gauge = <Gauge obj={obj}></Gauge>
        const testDesc = <a href="https://github.com/sillicon" target="_blank" rel="noopener noreferrer">Test case description</a>

        return <div key={obj.testName} className="areaCard">
            {title}{desc}{gauge}{testDesc}
        </div>
    });
    return <div id="detailCard">{divArr}<div id="reportList" className={"testListTip " + classes[props.browserName]} style={{display: "none"}}></div></div>
}

export default detailCard;