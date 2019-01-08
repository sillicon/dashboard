import React, {
    Component
} from "react";
import classes from "./App.css";
import Header from "./header";
import Footer from "./footer";
import Content from "./content";
import axios from "axios";
import * as moment from "moment";

class App extends Component {

	state = {
		user: null,
		envir: "Envir1",
		curDate: new Date(),
		reports: null
	}

	componentWillMount() {
		let currentUser = JSON.parse(sessionStorage.getItem("user"));
		if (currentUser) {
			this.setState({ user: currentUser });
		} else {
			axios.get("./getGitUser").then(res => {
				const info = res.data;
				if (info) {
					this.setState({ user: res.data })
				}
			});
		}
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
		console.log(selectDay);
		this.setState({curDate: selectDay});
		axios.get("./getLatestReports" + this.formatParams({
			envir: this.state.envir,
			testDate: moment(this.state.curDate).format("MM/DD/YYYY")
		})).then(res => {
			this.setState({reports: res.data});
		});
	}

	formatParams = (params) => {
        return "?" + Object
            .keys(params)
            .map(function (key) {
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
					queryChange={this.queryChange}></Content>
				<Footer></Footer>
			</div>
        );
    }
}

export default App;