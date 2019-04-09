import React, {
    Component
} from "react";
import * as d3 from "d3";
import "./sunburst.css";

class Sunburst extends Component {
    componentDidMount() {
        this.drawSunburst();
    }

    drawSunburst = () => {
        let reports = {...this.props.reports}
        let tempStr = getComputedStyle(document.querySelector("#sunburst")).width;
        let svgWidth = Math.min(parseInt(tempStr.substr(0, tempStr.length - 2)) - 50, window.innerHeight - 250);
        let svgHeight = svgWidth + 100;
        let radius = svgWidth / 2 - 40;
        let x = d3.scaleLinear()
            .range([0, 2 * Math.PI]);
        let y = d3.scaleSqrt()
            .range([0, radius])
        let partition = d3.partition();
        let arc = d3.arc()
            .startAngle(function(d) {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x0)));
            })
            .endAngle(function(d) {
                return Math.max(0, Math.min(2 * Math.PI, x(d.x1)));
            })
            .innerRadius(function(d) {
                return Math.max(0, y(d.y0));
            })
            .outerRadius(function(d) {
                return Math.max(0, y(d.y1));
            });
        let svg = d3.select("#sunburst").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", "translate(" + svgWidth / 2 + "," + (svgHeight / 2) + ")");
        reports = d3.hierarchy(reports, function children(d) {
            return d.child;
        });
        reports.sum(function(d) {
            if (d.child != null) {
                return 0;
            }
            return 1;
        });
        svg.selectAll("path")
            .data(partition(reports).descendants())
            .enter().append("path")
            .attr("d", arc)
            .attr("class", function(d) {
                if (d.data.hasOwnProperty("testResult")) {
                    if (d.data.testResult === "Pass") {
                        return "sunburstPath testPass";
                    }
                    return "sunburstPath testFail";
                } else {
                    return "sunburstPath norun";
                }
            })
            .on("click", click)
            .on("mouseover", hover)
            .append("title")
            .text(function(d) {
                return d.data.testName;
            });

        d3.select("#sunburst svg").append("text")
            .attr("font-size", "1.3rem")
            .attr("id", "cateDescription")
            .text("QA Category")
            .attr("transform", "translate(" + svgWidth / 2 + ", 20)")
            .attr("text-anchor", "middle");

        function click(d) {
            if (!d.children && d.data.hasOwnProperty("cateName")) {
                if (d.data.hasOwnProperty("reportURL")) {
                    window.open(d.data.reportURL);
                } else {
                    window.open(".\\report\\" + d.data.testName);
                }
            } else if (d.data.hasOwnProperty("loginURL")) {
                window.open(d.data.loginURL);
            } else if (d.data.hasOwnProperty("issueURL")) {
                window.open(d.data.issueURL);
            } else {
                svg.transition()
                    .duration(750)
                    .tween("scale", function() {
                        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                            yd = d3.interpolate(y.domain(), [d.y0, 1]),
                            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
                        return function(t) {
                            x.domain(xd(t));
                            y.domain(yd(t)).range(yr(t));
                        };
                    })
                    .selectAll("path")
                    .attrTween("d", function(d) {
                        return function() {
                            return arc(d);
                        };
                    });
            };
        }

        function hover(d) {
            let tempStr = getParent(d);
            let width = (svgWidth - 50) * 2 / 3;
            let text = d3.select("#cateDescription").text(tempStr);
            wrap(text, width);

            function getParent(obj) {
                var nameStr = "";
                if (obj.data.hasOwnProperty("loginURL")) {
                    nameStr = "Click here to authorize GitHub access";
                    return nameStr;
                } else if (obj.data.hasOwnProperty("issueURL")) {
                    nameStr = obj.data.issueName;
                } else {
                    nameStr = obj.data.testName;
                }
                if (obj.parent == null) {
                    return nameStr;
                } else {
                    return getParent(obj.parent) + ">" + nameStr;
                }
            }

            function wrap(text, width) {
                let words = text.text().split(/>/g).reverse(),
                    word,
                    line = [],
                    dy = parseFloat(text.attr("font-size")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", dy + "rem").attr("text-anchor", "middle");
                while (words.length > 0) {
                    word = words.pop()
                    line.push(word);
                    tspan.text(line.join(" > "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" > ") + " >");
                        line = [word];
                        tspan = text.append("tspan").attr("text-anchor", "middle").attr("x", 0).attr("dy", dy + "rem").text(word);
                    }
                }
                text.attr("transform", "translate(" + svgWidth / 2 + ", 20)");
            }
        }
        d3.select(window.frameElement).style("height", svgHeight + "px");
    }

    render() {
        return <div id="sunburst"></div>
    }
}

export default Sunburst;