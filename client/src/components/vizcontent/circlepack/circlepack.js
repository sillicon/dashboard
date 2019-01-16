import React, {
    Component
} from "react";
import * as d3 from "d3";
import "./circlepack.css";

class CirclePack extends Component {
    componentDidMount() {
        this.drawCirclePack();
    }

    drawCirclePack = () => {
        let reports = { ...this.props.reports
        };
        let tempStr = getComputedStyle(document.querySelector("#circlePack")).width;
        let svgWidth = Math.min(parseInt(tempStr.substr(0, tempStr.length - 2)) - 50, window.innerHeight - 200);
        let svgHeight = svgWidth;
        let svg = d3.select("#circlePack").append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .style("overflow", "hidden");
        let margin = 20,
            diameter = +svg.attr("width"),
            g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
        let color = d3.scaleLinear()
            .domain([0, 5])
            .range(["hsl(193, 50%, 80%)", "hsl(215,80%,40%)"])
            .interpolate(d3.interpolateHcl);
        let pack = d3.pack()
            .size([diameter - margin, diameter - margin])
            .padding(2);
        reports = d3.hierarchy(reports, function children(d) {
                return d.child;
            })
            .sum(function(d) {
                if (d.child != null) {
                    return 0;
                }
                return 1;
            })
            .sort(function(a, b) {
                return b.value - a.value;
            });
        let focus = reports,
            nodes = pack(reports).descendants(),
            view;
        let circle = g.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("class", function(d) {
                return d.parent ? d.children ? "circlePacknode" : "circlePacknode circlePacknode--leaf" : "circlePacknode circlePacknode--root";
            })
            .style("fill", function(d) {
                if (d.children) {
                    return color(d.depth);
                } else if (d.data.hasOwnProperty("testResult")) {
                    if (d.data.testResult === "Pass") {
                        return "#00a300";
                    }
                    return "#ff3030";
                } else {
                    return "#c7c7c7";
                }
            })
            .on("click", function(d) {
                if (focus !== d) {
                    zoom(d);
                    d3.event.stopPropagation();
                } else if (!d.children && d.data.hasOwnProperty("cateName")) {
                    if (d.data.hasOwnProperty("reportURL")) {
                        window.open(d.data.reportURL);
                    } else {
                        window.open(".\\report\\" + d.data.testName);
                    }
                } else if (d.data.hasOwnProperty("loginURL")) {
                    window.open(d.data.loginURL);
                } else if (d.data.hasOwnProperty("issueURL")) {
                    window.open(d.data.issueURL);
                };
            });
        g.selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("class", "circlePacklabel")
            .style("fill-opacity", function(d) {
                return d.parent === reports ? 1 : 0;
            })
            .style("display", function(d) {
                return d.parent === reports ? "inline" : "none";
            })
            .text(function(d) {
                if (d.data.hasOwnProperty("loginURL")) {
                    return "Click here to authorize GitHub access";
                } else if (d.data.hasOwnProperty("issueURL")) {
                    return d.data.issueName;
                } else if (d.data.hasOwnProperty("reportURL")) {
                    return d.data.reportURL;
                } else {
                    return d.data.testName;
                }
            });
        let node = g.selectAll("circle,text");
        svg.style("background", color(0))
            .on("click", function() {
                zoom(reports);
            });
        zoomTo([reports.x, reports.y, reports.r * 2 + margin]);

        function zoom(d) {
            focus = d;
            let transition = d3.transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .tween("zoom", function(d) {
                    let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                    return function(t) {
                        zoomTo(i(t));
                    };
                });

            transition.selectAll("text")
                .filter(function(d) {
                    return d.parent === focus || this.style.display === "inline";
                })
                .style("fill-opacity", function(d) {
                    return d.parent === focus ? 1 : 0;
                })
                .on("start", function(d) {
                    if (d.parent === focus) this.style.display = "inline";
                })
                .on("end", function(d) {
                    if (d.parent !== focus) this.style.display = "none";
                });
        }

        function zoomTo(v) {
            let k = diameter / v[2];
            view = v;
            node.attr("transform", function(d) {
                return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
            });
            circle.attr("r", function(d) {
                return d.r * k;
            });
        }
    }

    render() {
        return <div id="circlePack"></div>
    }
}

export default CirclePack;