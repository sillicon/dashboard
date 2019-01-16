import React, {
    Component
} from "react";
import * as d3 from "d3";

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
            totalTest = this.props.obj.child.length,
            passCount = this.props.obj.passCount;
        let svg = d3.select("#" + this.props.obj.testName.replace(/ /g)).append("svg").attr("style", "width: " + svgWidth + "px\; height: " + svgHeight + "px\;");
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
                return this.props.obj.child.map((ele) => {
                    if (ele.testResult === "Pass") {
                        if (ele.hasOwnProperty("reportURL")) {
                            return ele.reportURL;
                        } else {
                            return ele.fileName;
                        }
                    }
                });
            }).append("path").attr("class", "successArc")
            .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
            let failArc = svg.data(function() {
                return this.props.obj.child.map((ele) => {
                    if (ele.testResult === "Fail") {
                        if (ele.hasOwnProperty("reportURL")) {
                            return ele.reportURL;
                        } else {
                            return ele.fileName;
                        }
                    }
                });
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
                } else if (temp1 >= percent * 100 && temp2 == 0) {
                    arc1.endAngle(-Math.PI * 3 / 4 + percent * Math.PI * 3 / 2);
                    successArc.attr("d", arc1);
                    arc2.endAngle(-Math.PI * 3 / 4 + (percent + temp2 / 100) * Math.PI * 3 / 2);
                    failArc.attr("d", arc2);
                    temp2++;
                } else if (temp1 + temp2 < 100) {
                    arc2.endAngle(-Math.PI * 3 / 4 + (percent + temp2 / 100) * Math.PI * 3 / 2);
                    failArc.attr("d", arc2);
                    temp2++;
                } else if (temp1 + temp2 == 100) {
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
                        if (d[i].indexOf("http") > -1) {
                            tempHTML += "<span><a href='" + d[i] + "' target='_blank'>Click here for report</a></span><br>";
                        } else {
                            tempHTML += "<span><a href='.\\report\\" + d[i] + "' target='_blank'>" + d[i] + "</a></span><br>";
                        }
                    }
                    return tempHTML;
                });
                div.style("display", "block");
                div.style("left", function() {
                    let arcLeft = tempScg.getBoundingClientRect().left,
                        arcWidth = tempScg.getBoundingClientRect().width,
                        tipWidth = this.getBoundingClientRect().width,
                        scrollWidth;
                    //set ::after rule based on different browser
                    let sheet = document.styleSheets;
                    for (let i = 0; i < sheet.length; i++) {
                        if (sheet[i].href.indexOf("Home") > -1) {
                            if (isFirefox) {
                                mainSheet = sheet[i].cssRules;
                            } else {
                                mainSheet = sheet[i].rules;
                            }
                            i = sheet.length;
                            for (let j = 0; j < mainSheet.length; j++) {
                                if (mainSheet[j].selectorText === "div.testListTip::after") {
                                    tipAfterRule = mainSheet[j];
                                    j = mainSheet.length;
                                }
                            }
                        }
                    }
                    if (isIE) {
                        tipAfterRule.style.margin = "-5px 0px 0px -16px";
                    } else {
                        tipAfterRule.style.margin = "-5px 0px 0px -" + (tipWidth / 2 + 10) + "px";
                    }
                    if (isSafari || isEdge) {
                        scrollWidth = document.getElementsByTagName("body")[0].scrollLeft;
                    } else if (isChrome || isFirefox || isIE) {
                        scrollWidth = document.getElementsByTagName("html")[0].scrollLeft;
                    }
                    return ((arcLeft + pos[0] + scrollWidth + 15) + "px");
                });
                div.style("top", function() {
                    let arctTop = tempScg.getBoundingClientRect().top,
                        arcHeight = tempScg.getBoundingClientRect().height,
                        tipHeight = this.getBoundingClientRect().height,
                        scrollHeight;
                    if (isSafari || isEdge) {
                        scrollHeight = document.getElementsByTagName("body")[0].scrollTop;
                    } else if (isChrome || isFirefox || isIE) {
                        scrollHeight = document.getElementsByTagName("html")[0].scrollTop;
                    }
                    return ((arctTop + pos[1] + scrollHeight - tipHeight / 2) + "px");
                });
            });

        }
    }

    render() {
        return <div id={this.props.testName.replace(/ /g)}></div>
    }
}

const detailCard = (props) => {
    const divArr = props.reports.map((obj) => {
        const title = <div>{obj.testName}</div>
        const desc = <div>{"Total test run for today: " + obj.child.length}</div>

        const testDesc = <div></div>

        return
    });


    return <div id="detailCard"></div>
}

export default detailCard;