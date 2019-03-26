import React, {
    Component
} from "react";
import {
    Button,
    Grid,
    Dropdown
} from "semantic-ui-react";
import axios from "axios";
import DatePicker from "../datepicker/datepicker";
import classes from "./queryReport.module.css";

class QueryPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0,
            isResult: false,
            queryCategory: false,
            idRef: null,
            date1: new Date(),
            date2: new Date(),
            date1Limit: new Date()
        }
    }

    _isMounted =  false;
    _reqSent = false;

    switchDateRange = (num) => {
        this.setState({
            selected: num
        });
    }

    toggleCateQuery = () => {
        this.setState({
            queryCategory: !this.state.queryCategory
        }, () => {
            console.log(this.state.queryCategory)
        });
    }

    date1Change = (selectedDay) => {
        this.setState({
            date1: selectedDay
        });
    }

    date2Change = (selectedDay) => {
        const d1Date = this.state.date1;
        this.setState({
            date1Limit: selectedDay,
            date2: selectedDay,
            date1: selectedDay < d1Date ? selectedDay : d1Date
        });
    }

    componentDidMount() {
        console.log("did mount");
        console.dir(this.state.idRef)
        this._isMounted = true;
        if (!this._reqSent) {
            if (this._isMounted) {
                this._reqSent = true;
            }
            axios.get("/getIDRef").then((res) => {
                const idRef = Object.entries(res.data).map((arr) => {
                    return {
                        value: arr[0],
                        text: arr[1]
                    }
                });
                if (this._isMounted) {
                    this.setState({
                        idRef: idRef
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        console.log("will unmount");
        this._isMounted = false;
    }

    render() {
        const dateRangeOptions = [{
                key: 0,
                value: 3,
                text: "Last 3 days"
            }, {
                key: 1,
                value: 7,
                text: "Last 7 days"
            }, {
                key: 2,
                value: 14,
                text: "Last 2 weeks"
            }, {
                key: 3,
                value: 21,
                text: "Last 3 weeks"
            }, {
                key: 4,
                value: 28,
                text: "Last 4 weeks"
            },
            {
                key: 5,
                value: -1,
                text: "All Records"
            }
        ]
        const curDate = new Date();
        const singleDate = <div>
            <DatePicker curDate={curDate} position={"txtbox"} disabledDate={new Date()}></DatePicker>
        </div>
        const dateRange = <div>
            <DatePicker curDate={this.state.date1} position={"txtbox"} dayChanged={this.date1Change} disabledDate={this.state.date1Limit}></DatePicker>
            <span style={{paddingLeft: "10px", paddingRight: "10px"}}>to:</span>
            <DatePicker curDate={this.state.date2} position={"txtbox"} dayChanged={this.date2Change} disabledDate={curDate}></DatePicker>
        </div>
        const dateDropdown = <div><Dropdown placeholder="Select date ranges" selection options={dateRangeOptions} defaultValue={3}></Dropdown></div>
        const inlineStyle1 = {
            display: "block",
            width: "80%",
            maxWidth: "1200px",
            margin: "auto"
        }, inlineStyle2 = {
            paddingLeft: "0",
            width: "200px"
        }, inlineStyle3 = {
            paddingBottom: "0"
        }, inlineStyle4 = {
            paddingTop: "0",
            paddingBottom: "0"
        }
    
        return (
            <Grid style={inlineStyle1}>
                <Grid.Row columns={2} divided style={inlineStyle3}>
                    <Grid.Column style={inlineStyle2} >
                        <Button.Group vertical labeled icon>
                            <Button basic icon="calendar check" content="On Day" active={this.state.selected === 0} onClick={() => this.switchDateRange(0)}></Button>
                            <Button basic icon="calendar alternate" content="Between Day" active={this.state.selected === 1} onClick={() => this.switchDateRange(1)}></Button>
                            <Button basic icon="hourglass" content="Within" active={this.state.selected === 2} onClick={() => this.switchDateRange(2)}></Button>
                        </Button.Group>
                    </Grid.Column>
                    <Grid.Column>
                        {this.state.selected === 0 ? singleDate : (this.state.selected === 1 ? dateRange : dateDropdown)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} divided style={inlineStyle4}>
                    <Grid.Column style={inlineStyle2}></Grid.Column>
                    <Grid.Column>
                        <input id="cateCheck" type="checkbox" className={classes.checkbox} checked={this.state.queryCategory} onChange={this.toggleCateQuery}></input>
                        <label htmlFor="cateCheck" style={{margin: "auto 10px auto 0"}}>Search within a certain category:</label>
                        <Dropdown search multiple selection options={this.state.idRef} placeholder="Select Category" disabled={!this.state.queryCategory}></Dropdown>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} divided style={inlineStyle4}>
                    <Grid.Column style={inlineStyle2}>
                        <label style={{display: "inline-block", paddingTop: "10px"}}>Choose Environemnt: </label>
                    </Grid.Column>
                    <Grid.Column>
                        <div className={classes.envirContainer}>
                            <input id="envir1" type="checkbox" className={classes.checkbox} checked={true}></input>
                            <label htmlFor="envir1" className={classes.envirLabel}>Envir1</label>
                            <input id="envir2" type="checkbox" className={classes.checkbox}></input>
                            <label htmlFor="envir2"  className={classes.envirLabel}>Envir2</label>
                            <input id="envir3" type="checkbox" className={classes.checkbox}></input>
                            <label htmlFor="envir3"  className={classes.envirLabel}>Envir3</label>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <button className={classes.backButton}>Back</button>
                    <button className={classes.applyBut}>Apply</button>
                </Grid.Row>
            </Grid>
        )
    }
}

export default QueryPane;