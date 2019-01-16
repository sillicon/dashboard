import React, {
    Component
} from "react";
import * as d3 from "d3";
import "./tree.css";

class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.drawTree();
    }

    drawTree = () => {
        const margin = {
            top: 0,
            right: 80,
            bottom: 20,
            left: 120
        };
        let reports = {...this.props.reports};
        let tempStr = getComputedStyle(document.querySelector("#treeView")).width;
        let width = parseInt(tempStr.substr(0, tempStr.length - 2)) - 200,
            height = 800 - margin.top - margin.bottom;
        let i = 0,
            duration = 750;
        let treemap = d3.tree().size([height, width]);
        let svg = d3.select("#treeView").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        reports = d3.hierarchy(reports, function children(d) {
            return d.child;
        });
        reports.x0 = height / 2;
        reports.y0 = 0;
        reports.children.forEach(collapse);

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        update(reports);

        function update(source) {
            // Assigns the x and y position for the nodes
            let treeData = treemap(reports);
            // Compute the new tree layout.
            let nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            let normalize = width / 5;
            nodes.forEach(function(d) {
                d.y = d.depth * normalize;
            });

            // Update the nodes…
            let node = svg.selectAll("g.treeNode")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            let nodeEnter = node.enter().append("g")
                .attr("class", "treeNode")
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", click);

            // Add Circle for the nodes
            nodeEnter.append("circle")
                .attr("class", "treeNode")
                .attr("r", 1e-6)
                .style("fill", function(d) {
                    if (d.data.testResult === undefined) {
                        return d.children || d._children ? "lightsteelblue" : "#a1a1a1";
                    } else if (d.data.testResult === "Pass") {
                        return "#00a300";
                    } else if (d.data.testResult === "Fail") {
                        return "#ff3030";
                    }
                });

            // Add labels for the nodes
            nodeEnter.append("text")
                .attr("dy", ".35em")
                .attr("x", function(d) {
                    return d.children || d._children ? -13 : 13;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .attr("cursor", "pointer")
                .text(function(d) {
                    if (d.data.hasOwnProperty("loginURL")) {
                        return "Click here to authorize GitHub access";
                    } else if (d.data.hasOwnProperty("issueURL")) {
                        return d.data.issueName;
                    } else {
                        return d.data.testName;
                    }

                })
                .on("click", function(d) {
                    if (d.data.hasOwnProperty("cateName")) {
                        if (d.data.hasOwnProperty("reportURL")) {
                            window.open(d.data.reportURL);
                        } else {
                            window.open(".\\report\\" + d.data.testName);
                        }
                    } else if (d.data.hasOwnProperty("loginURL")) {
                        window.open(".\\login\\github");
                    } else if (d.data.hasOwnProperty("issueURL")) {
                        window.open(d.data.issueURL);
                    }
                });

            // UPDATE
            let nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Update the node attributes and style
            nodeUpdate.select("circle.treeNode")
                .attr("r", 10)
                .attr("cursor", "pointer");

            // Transition exiting nodes to the parent's new position.
            let nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            let link = svg.selectAll("path.treeLink")
                .data(links, function(d) {
                    return d.id;
                });

            // Enter any new links at the parent's previous position.
            let linkEnter = link.enter().insert("path", "g")
                .attr("class", "treeLink")
                .attr("d", function(d) {
                    let o = {
                        x: source.x0,
                        y: source.y0
                    }
                    return diagonal(o, o)
                });

            // UPDATE
            let linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr("d", function(d) {
                    return diagonal(d, d.parent)
                });

            // Remove any exiting links
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    let o = {
                        x: source.x,
                        y: source.y
                    }
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            let path = "M " + s.y + " " + s.x + " C " + (s.y + d.y) / 2 + " " + s.x + " , " + (s.y + d.y) / 2 + " " + d.x + " , " + d.y + " " + d.x;
            return path
        }
        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }

    render() {
        return <div id="treeView"></div>
    }
}

export default Tree;