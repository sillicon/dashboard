import React, {
    Component
} from "react";
import { BrowserRouter as Router} from "react-router-dom";
import "../semantic/semantic.min.css";
import classes from "./App.module.css";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Content from "./content";
import * as es6 from "es6-promise";
import axios from "axios";
import * as moment from "moment";
import * as Promise from "bluebird";
import * as detect from "detect-browser";

es6.polyfill();
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            envir: "Envir1",
            curDate: new Date(),
            reports: null,
            curViz: "Ordinary",
            isCategoryView: true,
            isLoading: true,
            browserName: detect.detect().name,
            summary: null,
            modalOpen: false
        }
    }

    componentWillMount() {}

    componentDidMount() {
        let currentUser = JSON.parse(sessionStorage.getItem("user"));
        if (currentUser) {
            this.setState({
                user: currentUser
            });
        } else {
            axios.get("./getGitUser").then(res => {
                const info = res.data;
                if (info) {
                    this.setState({
                        user: res.data
                    });
                }
            });
        }
        if (window.location.hash) {
            this.setState({
                envir: window.location.hash.substring(1)
            }, () => {
                this.queryReports();
            })
        } else {
            this.queryReports();
        }
        document.querySelector("body").addEventListener("click", function(e) {
            if (e.target.tagName !== "path") {
                if (document.querySelector("#reportList")) {
                    document.querySelector("#reportList").style.display = "none";
                }
            }
        });
    }

    githubLogin = () => {
        window.location = "./login/github";
    }

    checkProfile = () => {
        if (this.state.user) {
            window.open(this.state.user.profileUrl, "_blank");
        }
    }

    queryChange = (selectDay) => {
        this.setState({
            curDate: selectDay,
            isLoading: true
        }, () => {
            if (this.state.isCategoryView) {
                this.queryReports();
            } else {
                this.getLatestReports();
            }
        });
    }

    switchEnvir = (env) => {
        this.setState({
            envir: env,
            isLoading: true
        }, () => {
            if (this.state.isCategoryView) {
                this.queryReports();
            } else {
                this.getLatestReports();
            }
        });
    }

    changeViz = (newViz) => {
        if (newViz === "Category") {
            if (!this.state.isLoading) {
                this.setState({
                    curViz: "Ordinary",
                    isCategoryView: true
                });
                this.queryReports();
            }
        } else if (newViz === "DetailCard") {
            if (!this.state.isLoading) {
                this.setState({
                    curViz: "DetailCard",
                    isCategoryView: false
                });
                this.getLatestReports();
            }
        } else {
            this.setState({
                curViz: newViz
            });
        }
    }

    modalOpen = () => {
        this.setState({
            modalOpen: true
        });
    }

    modalClose = () => {
        this.setState({
            modalOpen: false
        });
    }

    getLatestReports = () => {
        this.setState({
            isLoading: true
        }, () => {
            const urls = [
                "./getLatestReports" + this.formatParams({
                    envir: this.state.envir,
                    testDate: moment(this.state.curDate).format("MM/DD/YYYY")
                }),
                "./getIDRef",
                "./getTestName"
            ]
            Promise.map(urls, (url) => {
                return axios.get(url);
            }).then((resArr) => {
                const reports = [...resArr[0].data],
                    areas = resArr[1].data,
                    res = [],
                    skipPos = [],
                    testSummary = {
                        passCount: 0,
                        testCount: 0
                    };
                for (let i = 0; i < reports.length; i++) {
                    const report = reports[i];
                    testSummary.testCount++;
                    if (report.testResult === "Pass") {
                        testSummary.passCount++;
                    }
                    if (res.length > 0) {
                        for (let j = 0; j < res.length; j++) {
                            const resEle = res[j];
                            if (resEle.testName === report.testName) {
                                resEle.child.push(report);
                                resEle.passCount = report.testResult === "Pass" ? resEle.passCount + 1 : resEle.passCount;
                                break;
                            } else if (j === res.length - 1) {
                                for (const key in areas) {
                                    console.log(key, skipPos.indexOf(key), skipPos);
                                    if (areas.hasOwnProperty(key) && skipPos.indexOf(key) < 0) {
                                        if (areas[key] === report.testName) {
                                            res.push({
                                                testName: areas[key],
                                                child: [report],
                                                passCount: report.testResult === "Pass" ? 1 : 0
                                            });
                                            skipPos.push(key);
                                            j++;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        for (const key in areas) {
                            if (areas.hasOwnProperty(key)) {
                                if (areas[key] === report.testName) {
                                    res.push({
                                        testName: areas[key],
                                        child: [report],
                                        passCount: report.testResult === "Pass" ? 1 : 0
                                    });
                                    skipPos.push(key);
                                    break;
                                }
                            }
                        }
                    }
                }
                for (const key in areas) {
                    if (areas.hasOwnProperty(key) && skipPos.indexOf(key) < 0) {
                        res.push({
                            testName: areas[key],
                            child: [],
                            passCount: 0
                        });
                    }
                }
                console.log(res);
                let summaryObj = {
                        0: {
                            testArea: 0,
                            coveredTestArea: 0
                        },
                        1: {
                            testArea: 0,
                            coveredTestArea: 0
                        },
                        2: {
                            testArea: 0,
                            coveredTestArea: 0
                        },
                        3: {
                            ...testSummary
                        }
                    },
                    stack = [];
                for (let k = 0; k < 3; k++) {
                    stack = [
                        [resArr[2].data[k], 0]
                    ];
                    while (stack.length > 0) {
                        let lastEle = stack[stack.length - 1];
                        if (lastEle[0].hasOwnProperty("id")) {
                            summaryObj[k].testArea++;
                            for (let p = 0; p < reports.length; p++) {
                                if (reports[p].testID === lastEle[0].id) {
                                    summaryObj[k].coveredTestArea++;
                                    break;
                                }
                            }
                            stack.pop();
                            if (stack.length > 0) {
                                stack[stack.length - 1][1]++;
                            }
                        } else {
                            if (lastEle[1] === lastEle[0].child.length) {
                                stack.pop();
                                if (stack.length > 0) {
                                    stack[stack.length - 1][1]++;
                                }
                            } else {
                                stack.push([lastEle[0].child[lastEle[1]], 0]);
                            }
                        }
                    }
                }
                this.setState({
                    reports: res,
                    isLoading: false,
                    summary: {
                        ...summaryObj
                    }
                });
            });
        });

    }

    queryReports = () => {
        this.setState({
            isLoading: true
        }, () => {
            const urls = [
                "./getLatestReports" + this.formatParams({
                    envir: this.state.envir,
                    testDate: moment(this.state.curDate).format("MM/DD/YYYY")
                }),
                "./getTestName"
            ]
            Promise.map(urls, (url) => {
                return axios.get(url);
            }).then((resArr) => {
                let root = {
                        testName: "QA Category",
                        child: resArr[1].data
                    },
                    resultList = resArr[0].data,
                    stack,
                    testSummary = {
                        passCount: 0,
                        testCount: 0
                    };
                for (let i = 0; i < resultList.length; i++) {
                    const report = resultList[i];
                    testSummary.testCount++;
                    if (report.testResult === "Pass") {
                        testSummary.passCount++;
                    }
                    stack = [
                        [root, 0]
                    ];
                    while (stack.length > 0) {
                        let lastEle = stack[stack.length - 1];
                        if (lastEle[0].hasOwnProperty("id")) {
                            if (lastEle[0].id === report.testID) {
                                if (!lastEle[0].hasOwnProperty("child")) {
                                    lastEle[0].child = [];
                                }
                                let insertObj = {
                                    testName: report.fileName,
                                    testResult: report.testResult,
                                    cateName: report.testName,
                                    uniqueID: report._id,
                                    comments: report.comments
                                }
                                if (report.hasOwnProperty("reportURL")) {
                                    insertObj.reportURL = report.reportURL;
                                }
                                lastEle[0].child.push(insertObj);
                                const bool = report.testResult;
                                for (let j = stack.length - 1; j > -1; j--) {
                                    const ele = stack[j][0];
                                    if (ele.hasOwnProperty("testResult")) {
                                        if (bool === "Fail" && ele.testResult === "Pass") {
                                            ele.testResult = bool;
                                        } else {
                                            break;
                                        }
                                    } else {
                                        ele.testResult = bool;
                                    }
                                }
                                break;
                            } else {
                                stack.pop();
                                stack[stack.length - 1][1]++;
                            }
                        } else {
                            if (lastEle[0].hasOwnProperty("child") && lastEle[1] < lastEle[0].child.length) {
                                stack.push([lastEle[0].child[lastEle[1]], 0]);
                            } else {
                                stack.pop();
                                if (stack.length > 0) {
                                    stack[stack.length - 1][1]++;
                                }
                            }
                        }
                    }
                }
                let summaryObj = {
                    0: {
                        testArea: 0,
                        coveredTestArea: 0
                    },
                    1: {
                        testArea: 0,
                        coveredTestArea: 0
                    },
                    2: {
                        testArea: 0,
                        coveredTestArea: 0
                    },
                    3: {
                        ...testSummary
                    }
                }
                for (let i = 0; i < 3; i++) {
                    stack = [
                        [root.child[i], 0]
                    ];
                    while (stack.length > 0) {
                        let lastEle = stack[stack.length - 1];
                        if (lastEle[0].hasOwnProperty("id")) {
                            summaryObj[i].testArea++;
                            if (lastEle[0].hasOwnProperty("child")) {
                                summaryObj[i].coveredTestArea++;
                            }
                            stack.pop();
                            if (stack.length > 0) {
                                stack[stack.length - 1][1]++;
                            }
                        } else {
                            if (lastEle[1] === lastEle[0].child.length) {
                                stack.pop();
                                if (stack.length > 0) {
                                    stack[stack.length - 1][1]++;
                                }
                            } else {
                                stack.push([lastEle[0].child[lastEle[1]], 0]);
                            }
                        }
                    }
                }
                console.log(summaryObj)
                this.setState({
                    reports: root,
                    isLoading: false,
                    summary: {
                        ...summaryObj
                    }
                });
            });
        });
    }

    formatParams = (params) => {
        return "?" + Object
            .keys(params)
            .map(function(key) {
                return key + "=" + params[key]
            })
            .join("&")
    }

    render() {
        return (
            <Router>
                <div className={classes.App} >
                    <Header
                        userInfo={this.state.user}
                        gitLogin={this.githubLogin}
                        checkProfile={this.checkProfile}></Header>
                    <Content
                        envir={this.state.envir}
                        curDate={this.state.curDate}
                        queryChange={this.queryChange}
                        switchEnvir={this.switchEnvir}
                        curViz={this.state.curViz}
                        isCategoryView={this.state.isCategoryView}
                        reports={this.state.reports}
                        isLoading={this.state.isLoading}
                        changeViz={this.changeViz}
                        browserName={this.state.browserName}
                        summary={this.state.summary}
                        modalOpen={this.modalOpen}
                        modalClose={this.modalClose}
                        isModalOpen={this.state.modalOpen}></Content>
                    <Footer></Footer>
                </div>
            </Router> 
        );
    }
}

export default App;