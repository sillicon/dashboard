import React, {
    Component
} from "react";
import * as d3 from "d3";
import "./reportChart.css";

class QueryChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            browserName: props.browserName,
            data: props.data,
            hasData: false
        }
        for (let i = 0; i < props.data.length; i++) {
            if (props.data[i].length !== 0) {
                this.state.hasData = true;
                break;
            }
        }
    }

    componentDidMount = () => {
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].length > 0) {
                this.createCharts(this.state.data[i], "Envir" + (i + 1));
            }
        }
    }

    createCharts = (inputArray, envir) => {
        d3.select("#charts").append("span").html("<b>" + envir + "</b>");

        let category = [],
            cateArray = [],
            fullArray = [],
            passfileArray = [],
            failfileArray = [],
            passRatio = 0,
            passCount = 0,
            failCount = 0;

        for (let i = 0; i < inputArray.length; i++) {
            if (inputArray[i].testResult === "Pass") {
                passCount = passCount + 1;
                passfileArray.push(inputArray[i].fileName);
            } else {
                failCount = failCount + 1;
                failfileArray.push(inputArray[i].fileName);
            }
            if (i < inputArray.length - 1) {
                if (inputArray[i].testID !== inputArray[i + 1].testID) {
                    passRatio = passCount / (passCount + failCount);
                    cateArray.push({
                        date: inputArray[i].testDate,
                        ratio: passRatio,
                        counts: passCount + failCount,
                        testName: inputArray[i].testName,
                        passFiles: passfileArray,
                        failFiles: failfileArray
                    });
                    passfileArray = [];
                    failfileArray = [];
                    passCount = 0;
                    failCount = 0;
                    fullArray.push(cateArray);
                    category.push(inputArray[i].testName);
                    cateArray = [];
                } else if (inputArray[i].testDate !== inputArray[i + 1].testDate) {
                    passRatio = passCount / (passCount + failCount);
                    cateArray.push({
                        date: inputArray[i].testDate,
                        ratio: passRatio,
                        counts: passCount + failCount,
                        testName: inputArray[i].testName,
                        passFiles: passfileArray,
                        failFiles: failfileArray
                    });
                    passfileArray = [];
                    failfileArray = [];
                    passCount = 0;
                    failCount = 0;
                }
            } else {
                passRatio = passCount / (passCount + failCount);
                cateArray.push({
                    date: inputArray[i].testDate,
                    ratio: passRatio,
                    counts: passCount + failCount,
                    testName: inputArray[i].testName,
                    passFiles: passfileArray,
                    failFiles: failfileArray
                });
                passfileArray = [];
                failfileArray = [];
                passCount = 0;
                failCount = 0;
                fullArray.push(cateArray);
                category.push(inputArray[i].testName);
                cateArray = [];
            }
        }

        let minDate = new Date(Date.parse(d3.min(fullArray, function(d) {
                return d3.extent(d, function(p) {
                    return toLocaleDate(new Date(p.date))
                })[0]
            }))),
            maxDate = new Date(Date.parse(d3.max(fullArray, function(d) {
                return d3.extent(d, function(p) {
                    return toLocaleDate(new Date(p.date))
                })[1]
            }))),
            dateRange = Math.round((maxDate - minDate) / 1000 / 3600 / 24);

        let margin = {
                top: 20,
                right: 20,
                bottom: 40,
                left: 100
            },
            svgWidth = 960,
            svgHeight = Math.max(250, category.length * 60),
            width = svgWidth - margin.left - margin.right,
            height = svgHeight - margin.top - margin.bottom,
            barHeight = 40;
        let svg = d3.select("#charts").append("svg")
            .attr("id", envir)
            .attr("style", "width: " + svgWidth + "px; height: " + svgHeight + "px;");
        let x = d3.scaleTime().range([0, width])
            .domain([minDate, calculateDays(maxDate, 1)]);
        let y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1)
            .domain(category);
        let xAxis = d3.axisBottom(x);
        xAxis.tickValues(createTickValues(minDate, calculateDays(maxDate, 1), Math.round(Math.max(80 * dateRange / svgWidth, 1)))).tickFormat(d3.timeFormat("%m-%d"));

        let yAxis = d3.axisLeft(y);
        let zoom = d3.zoom()
            .scaleExtent([1, Math.round(80 * dateRange / svgWidth)])
            .translateExtent([
                [0, 0],
                [width, height]
            ])
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("zoom", zoomed);

        let drawArea = svg.append("g").attr("id", "bars");
        let rectangles = drawArea.selectAll("rect");
        for (let i = 0; i < fullArray.length; i++) {
            createRect(rectangles, fullArray[i]);
        }
        let passBar = drawArea.selectAll(".passBar");
        let failBar = drawArea.selectAll(".failBar");
        drawBar(drawArea, x);
        bindMouseEvent(passBar, "pass");
        bindMouseEvent(failBar, "fail");

        d3.selectAll("rect").filter((d, i, n) => {
            return parseFloat(n[i].getAttribute("width")) === 0;
        }).remove();

        //add grid lines
        let gridX = d3.axisTop(x);
        gridX.ticks(d3.timeDay.every(Math.round(Math.max(80 * dateRange / svgWidth, 1))))
            .tickSize(-height)
            .tickFormat("");
        let gridLine = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .attr("class", "gridLine");
        gridLine.call(gridX);

        // always draw axis at last
        let xLine = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .attr("class", "xAxis");
        xLine.call(xAxis)
            .selectAll("text")
            .style("text-anchor", "middle");
        let yLine = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .attr("class", "yAxis");
        yLine.call(yAxis)
            .selectAll("text")
            .attr("class", "cateName")
            .style("text-anchor", "start")
            .call(wrapText, margin.left - 12);

        svg.on("click", function() {
            if (d3.event.target.tagName !== "rect") {
                let div = d3.select(".chartTip");
                let clickedRect = svg.select(".clicked");
                if (clickedRect.empty() === false) {
                    clickedRect.attr("class", clickedRect.attr("class").split(" ")[0]).style("fill", "");
                }
                div.style("display", "none");
            }
        });

        svg.call(zoom);

        // fixScroll(d3.select("#" + envir));

        function createRect(svgGroup, dateArray) {
            svgGroup.data(dateArray).enter().filter((data) => {
                return data.passFiles.length > 0;
            }).append("rect").attr("class", "passBar");
            svgGroup.data(dateArray).enter().filter((data) => {
                return data.failFiles.length > 0;
            }).append("rect").attr("class", "failBar");
        }

        function drawBar(svgGroup, xScale) {
            svgGroup.selectAll(".passBar").attr("width", function(d) {
                return xScale(calculateDays(toLocaleDate(d.date), d.ratio)) - xScale(toLocaleDate(d.date));
            }).attr("transform", function(d) {
                return "translate(" + (margin.left + xScale(toLocaleDate(d.date))) + ", 0)";
            });
            svgGroup.selectAll(".failBar").attr("width", function(d) {
                return xScale(calculateDays(toLocaleDate(d.date), 1 - d.ratio)) - xScale(toLocaleDate(d.date));
            }).attr("transform", function(d) {
                return "translate(" + (margin.left + xScale(calculateDays(toLocaleDate(d.date), d.ratio))) + ", 0)";
            });
            svgGroup.selectAll("rect").attr("height", barHeight).attr("y", function(d) {
                return y(d.testName) + (y.bandwidth() - barHeight) / 2;
            });
        }

        function bindMouseEvent(svgGroup, result) {
            svgGroup.on("mouseover", function(d) {
                    let rectBox = this;
                    let div = d3.select(".tooltip");
                    div.transition()
                        .duration(300)
                        .style("opacity", .9);
                    div.html(function() {
                            let testCount, tempStr1, tempStr2
                            if (result === "pass") {
                                testCount = Math.round(d.ratio * d.counts);
                                tempStr1 = " passed";
                            } else {
                                testCount = Math.round((1 - d.ratio) * d.counts);
                                tempStr1 = " failed";
                            }
                            if (testCount > 1) {
                                tempStr2 = " tests";
                            } else {
                                tempStr2 = " test";
                            }
                            return "<span>" + testCount + tempStr2 + tempStr1 + "</span><br>";
                        })
                        .style("left", function() {
                            let rectLeft = rectBox.getBoundingClientRect().left,
                                rectWidth = rectBox.getBoundingClientRect().width,
                                tipWidth = this.getBoundingClientRect().width,
                                scrollWidth;
                            // if (isSafari || isEdge) {
                            //     scrollWidth = document.getElementsByTagName("body")[0].scrollLeft;
                            // } else if (isChrome || isFirefox || isIE) {
                                scrollWidth = document.getElementsByTagName("html")[0].scrollLeft;
                            // }
                            return ((rectLeft + rectWidth / 2 - tipWidth / 2 + scrollWidth) + "px");
                        })
                        .style("top", function() {
                            let rectTop = rectBox.getBoundingClientRect().top,
                                tipHeight = this.getBoundingClientRect().height,
                                scrollHeight;
                            // if (isSafari || isEdge) {
                            //     scrollHeight = document.getElementsByTagName("body")[0].scrollTop;
                            // } else if (isChrome || isFirefox || isIE) {
                                scrollHeight = document.getElementsByTagName("html")[0].scrollTop;
                            // }
                            return ((scrollHeight + rectTop - tipHeight - 10) + "px");
                        });
                })
                .on("mouseout", function() {
                    let div = d3.select(".tooltip");
                    div.transition()
                        .duration(200)
                        .style("opacity", 0);
                })
                .on("click", function(d) {
                    let rect = d3.select(this),
                        rectBox = this;
                    let div = d3.select(".chartTip");
                    if (rect.attr("class").indexOf("clicked") > -1) {
                        rect.attr("class", rect.attr("class").split(" ")[0]);
                        rect.attr("style", "");
                        div.style("display", "none");
                    } else {
                        let clickedRect = svg.select(".clicked");
                        if (clickedRect.empty() === false) {
                            clickedRect.attr("class", clickedRect.attr("class").split(" ")[0]).style("fill", "");
                        }
                        rect.attr("class", rect.attr("class") + " clicked");
                        rect.style("fill", window.getComputedStyle(this).fill);
                        div.html(function() {
                            let tempHTML = "";
                            if (result === "pass") {
                                if (d.passFiles.length > 1) {
                                    tempHTML += "<span>Passed Reports:</span><br>";
                                } else {
                                    tempHTML += "<span>Passed Report:</span><br>";
                                }
                                for (let i = 0; i < d.passFiles.length; i++) {
                                    tempHTML += "<span><a href='.\\report\\" + d.passFiles[i] + "' target='_blank'>" + d.passFiles[i] + "</a></span><br>";
                                }
                            } else {
                                if (d.failFiles.length > 1) {
                                    tempHTML += "<span>Failed Reports:</span><br>";
                                } else {
                                    tempHTML += "<span>Failed Report:</span><br>";
                                }
                                for (let i = 0; i < d.failFiles.length; i++) {
                                    tempHTML += "<span><a href='.\\report\\" + d.failFiles[i] + "' target='_blank'>" + d.failFiles[i] + "</a></span><br>";
                                }
                            }
                            return tempHTML;
                        });
                        div.style("display", "block");
                        div.style("--margins", function() {
                            let tipWidth = this.getBoundingClientRect().width;
                            return "-5px 0px 0px -" + (tipWidth / 2 + 10) + "px";
                        });
                        div.style("left", function() {
                                let rectLeft = rectBox.getBoundingClientRect().left,
                                    rectWidth = rectBox.getBoundingClientRect().width,
                                    scrollWidth = document.getElementsByTagName("html")[0].scrollLeft;
                                return ((rectLeft + rectWidth + scrollWidth + 10) + "px");
                            }).style("top", function() {
                                let rectTop = rectBox.getBoundingClientRect().top,
                                    rectHeight = rectBox.getBoundingClientRect().height,
                                    tipHeight = this.getBoundingClientRect().height,
                                    scrollHeight;
                                // if (isSafari || isEdge) {
                                //     scrollHeight = document.getElementsByTagName("body")[0].scrollTop;
                                // } else if (isChrome || isFirefox || isIE) {
                                    scrollHeight = document.getElementsByTagName("html")[0].scrollTop;
                                // }
                                return ((scrollHeight + rectTop + rectHeight / 2 - tipHeight / 2) + "px");
                            });
                    }
                });
        }

        function zoomed() {
            //when zoom remove tooltip
            let div = d3.select(".tooltip");
            div.style("opacity", 0);
            //don't show reports
            div = d3.select(".chartTip");
            div.style("display", "none");
            let clickedRect = svg.select(".clicked");
            if (clickedRect.empty() === false) {
                clickedRect.attr("class", clickedRect.attr("class").split(" ")[0]).style("fill", "");
            }
            //draw bars
            let newX = d3.event.transform.rescaleX(x);
            drawBar(drawArea, newX);
            svg.selectAll("rect").filter(function() {
                    let trans = this.attributes.transform.value;
                    trans = trans.slice(trans.indexOf("(") + 1, trans.indexOf(","));
                    trans = parseFloat(trans);
                    return trans < 99 || trans > width + 100;
                })
                .style("display", "none");
            svg.selectAll("rect").filter(function() {
                    let trans = this.attributes.transform.value;
                    trans = trans.slice(trans.indexOf("(") + 1, trans.indexOf(","));
                    trans = parseFloat(trans);
                    return trans > 98 && trans < width + 101;
                })
                .style("display", "block");

            //redraw grid line
            gridX.tickValues(createTickValues(minDate, calculateDays(maxDate, 1), Math.round(Math.max(80 * dateRange / svgWidth / d3.event.transform.k, 1))));
            gridLine.call(gridX.scale(newX));
            gridLine.selectAll("g").filter(function() {
                    let trans = this.attributes.transform.value;
                    trans = trans.slice(trans.indexOf("(") + 1, trans.indexOf(","));
                    trans = parseFloat(trans);
                    return trans < -1 || trans > width + 1;
                })
                .remove();
            //always draw axis last
            xAxis.tickValues(createTickValues(minDate, calculateDays(maxDate, 1), Math.round(Math.max(80 * dateRange / svgWidth / d3.event.transform.k, 1))));
            xLine.call(xAxis.scale(newX));
            xLine.selectAll("g").filter(function() {
                    let trans = this.attributes.transform.value;
                    trans = trans.slice(trans.indexOf("(") + 1, trans.indexOf(","));
                    trans = parseFloat(trans);
                    return trans < -1 || trans > width + 1;
                })
                .remove(); // remove out of bound ticks
        }

        function calculateDays(date, number) {
            let calD = new Date(Date.parse(date));
            calD.setHours(Math.round(number * 24 - number * 24 % 1));
            calD.setMinutes(Math.round(number * 24 % 1 * 60));
            return calD;
        }

        function toLocaleDate(input) {
            let temp = new Date(input);
            temp = new Date(temp.getTime() + temp.getTimezoneOffset() * 60000);
            return temp;
        }

        function createTickValues(startDate, endDate, space) { // have to create own tick values since ticks restarts at the first day of the new month
            let dArr = [],
                step = 0;
            while ((calculateDays(startDate, step) <= endDate)) {
                dArr.push(calculateDays(startDate, step));
                step += space;
            }
            return dArr;
        }

        function wrapText(text, width) {
            text.each(function() {
                let text = d3.select(this),
                    textContent = text.text(),
                    tempWord = addBreakSpace(textContent).split(/\s+/),
                    x = text.attr("x"),
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy") || 0),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                for (let i = 0; i < tempWord.length; i++) {
                    tempWord[i] = calHyphen(tempWord[i]);
                }
                textContent = tempWord.join(" ");
                let words = textContent.split(/\s+/).reverse(),
                    word = words.pop(),
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    spanContent,
                    breakChars = ["/", "&", "-"];
                while (word) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        spanContent = line.join(" ");
                        for (let i = 0; i < breakChars.length; i++) {
                            const char = breakChars[i];
                            spanContent = spanContent.replace(char + " ", char);
                        }
                        tspan.text(spanContent);
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                    word = words.pop();
                }
                let emToPxRatio = parseInt(window.getComputedStyle(text._groups[0][0]).fontSize.slice(0, -2));
                text.attr("transform", "translate(-" + (margin.left - 13) + ", -" + lineNumber / 2 * lineHeight * emToPxRatio + ")");

                function calHyphen(word) {
                    tspan.text(word);
                    if (tspan.node().getComputedTextLength() > width) {
                        let chars = word.split("");
                        let asword = "";
                        for (let i = 0; i < chars.length; i++) {
                            asword += chars[i];
                            tspan.text(asword);
                            if (tspan.node().getComputedTextLength() > width) {
                                if (chars[i - 1] !== "-") {
                                    word = word.slice(0, i - 1) + "- " + calHyphen(word.slice(i - 1));
                                }
                                i = chars.length;
                            }
                        }
                    }
                    return word;
                }
            });

            function addBreakSpace(inputString) {
                let breakChars = ["/", "&", "-"];
                breakChars.forEach(function(char) {
                    // Add a space after each break char for the function to use to determine line breaks
                    let reg = new RegExp(char, "g");
                    inputString = inputString.replace(reg, char + " ");
                });
                return inputString;
            }
        }

        function fixScroll(inputElement) {
            let height = inputElement.height(),
                scrollHeight;
            // if (isChrome || isIE) {
            //     scrollHeight = inputElement.get(0).scrollHeight;
            // } else {
                scrollHeight = parseInt(inputElement.height());
            // }
            inputElement.off("mousewheel").on("mousewheel", function(event) {
                let blockScrolling = (((this.scrollTop === scrollHeight - height && event.deltaY < 0) || this.scrollTop === 0) && event.deltaY > 0);
                return !blockScrolling;
            });
        }
    }

    render() {
        const chartDiv = <div>
            <div id="charts"></div>
            <div id="tooltip" className="tooltip" style={{opacity:0}}></div>
            <div id="chartTip" className="chartTip" style={{display:"none"}}></div>
        </div>;
        const noDataDiv = <div>No Data</div>;
        return (
            <>
                {this.state.hasData ? chartDiv : noDataDiv}
            </>
        )
    }
}

export default QueryChart;