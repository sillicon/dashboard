import React, {
    Component
} from "react";
import classes from "./App.css";
import Header from "./header";
import axios from "axios";

class App extends Component {

	state = {
		user: null
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

    render() {
        return (
			<div className = {classes.App} >
				<Header
					userInfo={this.state.user}
					gitLogin={this.githubLogin}
					checkProfile={this.checkProfile}></Header>
			</div>
        );
    }
}

export default App;