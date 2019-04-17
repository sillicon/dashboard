import React, {
    Component
} from "react";
import * as d3 from "d3";
import "./treemap.css";

class TreeMap extends Component {

    componentDidMount() {
        this.drawTreeMap();
    }

    drawTreeMap = () => {
        let reports = {
            testName: this.props.reports.testName,
            testResult: this.props.reports.testResult
        };
        reports.child = [...this.props.reports.child]
        reports.child.splice(3); // do not show github issues in Treemap view
        let tempStr = getComputedStyle(document.querySelector("#treemap")).width;
        let svgWidth = parseInt(tempStr.substr(0, tempStr.length - 2)) - 50;
        let svgHeight = svgWidth + 100;
        let svg = d3.select("#treemap").append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)

        let color = d3.scaleLinear()
            .domain([0, 7])
            .range(["hsl(193, 50%, 80%)", "hsl(215,80%,40%)"])
            .interpolate(d3.interpolateHcl);

        let treemap = d3.treemap()
            .size([svgWidth, svgHeight])
            .paddingOuter(5)
            .paddingTop(32)
            .paddingInner(5)
            .tile(d3.treemapBinary);

        reports = d3.hierarchy(reports, function children(d) {
            return d.child;
        });
        reports.sum(function(d) {
            if (d.child != null) {
                if (d.hasOwnProperty("id")) {
                    return 1;
                }
                return 0;
            }
            return 1;
        });

        treemap(reports);

        let cell = svg
            .selectAll(".treemapNode")
            .data(reports.descendants())
            .enter().append("g")
            .attr("transform", function(d) {
                return "translate(" + d.x0 + "," + d.y0 + ")";
            })
            .attr("class", "treemapNode")
            .each(function(d) {
                d.node = this;
            })
            .on("mouseover", hovered(true))
            .on("mouseout", hovered(false))
            .on("click", click);

        cell.append("rect")
            .attr("id", function(d) {
                if (d.data.hasOwnProperty("cateName")) {
                    return "rect-" + encodeURI(d.data.testName.substring(0, d.data.testName.lastIndexOf(".")));
                }
                return "rect-" + encodeURI(d.data.testName);
            })
            .attr("width", function(d) {
                return d.x1 - d.x0;
            })
            .attr("height", function(d) {
                return d.y1 - d.y0;
            })
            .style("fill", function(d) {
                if (d.data.hasOwnProperty("cateName")) {
                    if (d.data.testResult === "Pass") {
                        return "#79de79";
                    }
                    return "#ff7777";
                } else {
                    return color(d.depth);
                }
            });

        cell.append("clipPath")
            .attr("id", function(d) {
                if (d.data.hasOwnProperty("cateName")) {
                    return "clip-" + encodeURI(d.data.testName.substring(0, d.data.testName.lastIndexOf(".")));
                }
                return "clip-" + encodeURI(d.data.testName);
            })
            .append("use")
            .attr("xlink:href", function(d) {
                if (d.data.hasOwnProperty("cateName")) {
                    return "#rect-" + encodeURI(d.data.testName.substring(0, d.data.testName.lastIndexOf(".")));
                }
                return "#rect-" + encodeURI(d.data.testName);
            });

        let label = cell.append("text")
            .attr("class", "treemapNode")
            .attr("clip-path", function(d) {
                if (d.data.hasOwnProperty("cateName")) {
                    return "url(#clip-" + encodeURI(d.data.testName.substring(0, d.data.testName.lastIndexOf("."))) + ")";
                }
                return "url(#clip-" + encodeURI(d.data.testName) + ")";
            });

        label.filter(function(d) {
                return d.children;
            })
            .selectAll("tspan")
            .data(function(d) {
                return [d.data.testName];
            })
            .enter().append("tspan")
            .attr("x", function(d, i) {
                return i ? null : 5;
            })
            .attr("y", 20)
            .text(function(d) {
                return d;
            });

        label.filter(function(d) {
                return !d.children;
            })
            .selectAll("tspan")
            .data(function(d) {
                if (d.data.hasOwnProperty("cateName")) {
                    let collect = d.data.testName.substring(0, d.data.testName.lastIndexOf(".")).match(/[a-zA-Z JSAPI4.x-]+|[0-9_]+/g);
                    let tempCol = collect[1].split(/_/g);
                    collect[1] = "";
                    collect[2] = tempCol[0] + "/" + tempCol[1] + "/" + tempCol[2];
                    collect[3] = tempCol[3] + ":" + tempCol[4] + ":" + tempCol[5];
                    return collect;
                }
                return d.data.testName.split(/ /g);
            })
            .enter().append("tspan")
            .attr("x", 5)
            .attr("y", function(d, i) {
                return 20 + i * 20;
            })
            .text(function(d) {
                return d;
            });
        label.filter(function(d) {
                return d.data.hasOwnProperty("cateName");
            })
            .attr("class", "treemapNode reportName")
            .attr("cursor", "pointer");

        cell.append("title")
            .text(function(d) {
                if (d.data.hasOwnProperty("reportURL")) {
                    return d.data.reportURL;
                }
                return d.data.testName;
            });

        function hovered(hover) {
            return function(d) {
                d3.selectAll(d.ancestors().map(function(d) {
                        return d.node;
                    }))
                    .classed("treemapNode--hover", hover)
                    .select("rect")
                    .attr("width", function(d) {
                        return d.x1 - d.x0 - hover;
                    })
                    .attr("height", function(d) {
                        return d.y1 - d.y0 - hover;
                    });
            };
        }

        function click(d) {
            if (!d.children && d.data.hasOwnProperty("cateName")) {
                if (d.data.hasOwnProperty("reportURL")) {
                    window.open(d.data.reportURL);
                } else {
                    window.open(".\\report\\" + d.data.testName);
                }
            }
        }
    }

    render() {
        return <div id="treemap"></div>
    }
}

export default TreeMap;