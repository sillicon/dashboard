import React, {
    Component
} from "react";
import classes from "./App.css";
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
        isCategoryView: true
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
            curDate: selectDay
        });
        this.queryReports();
    }

    switchEnvir = (env) => {
        this.setState({
            envir: env
        });
        this.queryReports();
	}
	
	queryReports = () => {
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
                reports: root
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
					reports={this.state.reports}></Content>
				<Footer></Footer>
			</div>
        );
    }
}

export default App;