import React, {
    Component
} from "react";
import "../semantic/semantic.min.css";
import classes from "./App.module.css";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Content from "./content";
import axios from "axios";
import * as moment from "moment";
import * as Promise from "bluebird";

class App extends Component {

    state = {
        user: null,
        envir: "Envir1",
        curDate: new Date(),
        reports: null,
        curViz: "Ordinary",
        isCategoryView: true,
        isLoading: true
    }

    componentWillMount() {
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
		this.queryReports();
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
            this.queryReports();
        });
    }

    switchEnvir = (env) => {
        this.setState({
            envir: env,
            isLoading: true
        }, () => {
            this.queryReports();
        });
	}
    
    changeViz = (newViz) => {
        if (newViz === "Category") {
            this.setState({
                curViz: "Ordinary",
                isCategoryView: true
            });
            this.queryReports();
        } else if (newViz === "DetailCard") {
            this.setState({
                curViz: "DetailCard",
                isCategoryView: false
            });
            this.getLatestReports();
        } else {
            this.setState({
                curViz: newViz
            });
        }
    }

    getLatestReports = () => {
        this.setState({
            isLoading: true
        });
        const urls = [
            "./getLatestReports" + this.formatParams({
                envir: this.state.envir,
                testDate: moment(this.state.curDate).format("MM/DD/YYYY")
            }),
            "./getIDRef"
        ]
        Promise.map(urls, (url) => {
            return axios.get(url);
        }).then((resArr) => {
            const reports = [...resArr[0].data], areas = resArr[1].data, res = [];
            for (const key in areas) {
                if (areas.hasOwnProperty(key)) {
                    const newObj = {
                        testName: areas[key],
                        child: [],
                        passCount: 0
                    }
                    for (let i = 0; i < reports.length; i++) {
                        const report = reports[i];
                        if (newObj.testName === report.testName) {
                            if (report.testResult === "Pass") {
                                newObj.passCount++;
                            }
                            newObj.child.push(report);
                            reports.splice(i, 1);
                            break;
                        }
                    }
                    res.push(newObj);
                }
            }
            console.log(res);
            this.setState({
                reports: res,
                isLoading: false
            });
        });
    }

	queryReports = () => {
        this.setState({
            isLoading: true
        });
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
                stack;
            for (let i = 0; i < resultList.length; i++) {
                const report = resultList[i];
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
                            for (let j = stack.length - 1; j > -1 ; j--) {
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
            this.setState({
                reports: root,
                isLoading: false
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
            <div className = {classes.App} >
				<Header
					userInfo={this.state.user}
					gitLogin={this.githubLogin}
					checkProfile={this.checkProfile}>
				</Header>
				<Content
					envir={this.state.envir}
					curDate={this.state.curDate}
					queryChange={this.queryChange}
					switchEnvir={this.switchEnvir}
					curViz={this.state.curViz}
					isCategoryView={this.state.isCategoryView}
					reports={this.state.reports}
                    isLoading={this.state.isLoading}
                    changeViz={this.changeViz}></Content>
				<Footer></Footer>
			</div>
        );
    }
}

export default App;