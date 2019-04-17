import React, {
    Component
} from "react";
import {
    Button,
    Grid,
    Dropdown
} from "semantic-ui-react";
import {Loader} from "semantic-ui-react";
import axios from "axios";
import {formatDate} from 'react-day-picker/moment';
import DatePicker from "../datepicker/datepicker";
import QueryChart from "./reportChart";
import classes from "./queryReport.module.css";

class QueryPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isResult: false,
            isLoading: false,
            selected: 0,
            queryCategory: false,
            idRef: null,
            selectedCate: [],
            date1: new Date(),
            date2: new Date(),
            queryRange: 3,
            queryEnvir: {
                envir1: true,
                envir2: false,
                envir3: false
            },
            queryReady: true,
            queryData: null,
            browserName: props.browserName
        }
    }

    _isMounted =  false;
    _reqSent = false;

    switchDateRange = (num) => {
        this.setState({
            selected: num
        });
    }

    validateQuery = () => {
        let envirSeled = false;
        for (let key in this.state.queryEnvir) {
            if (this.state.queryEnvir[key]) {
                envirSeled = true;
                break;
            }
        }
        if (envirSeled) {
            if (!this.state.queryCategory) {
                this.setState({
                    queryReady: true
                });
            } else {
                let bool = this.state.selectedCate.length === 0;
                this.setState({
                    queryReady: !bool
                });
            }
        } else {
            this.setState({
                queryReady: false
            });
        }
    }

    cateSelChange = (event, data) => {
        this.setState({
            selectedCate: [...data.value]
        }, () => {
            this.validateQuery();
        });
    }

    toggleCateQuery = () => {
        this.setState({
            queryCategory: !this.state.queryCategory
        }, () => {
            this.validateQuery();
        });
    }

    tooglEnvir = (key) => {
        let tempEnvir = {...this.state.queryEnvir};
        tempEnvir[key] = !tempEnvir[key];
        this.setState({
            queryEnvir: {...tempEnvir}
        }, () => {
            this.validateQuery();
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
            date2: selectedDay,
            date1: selectedDay < d1Date ? selectedDay : d1Date
        });
    }

    rangeChange = (data) => {
        this.setState({
            queryRange: data.value
        });
    }

    startQuery = () => {
        this.setState({
            isResult: true,
            isLoading: true
        }, () => {//state change complete, start querying
            let queryObj = {
                reportEnvir1: this.state.queryEnvir.envir1,
                reportEnvir2: this.state.queryEnvir.envir2,
                reportEnvir3: this.state.queryEnvir.envir3
            }
            if (this.state.selected === 1 || this.state.selected === 2) {
                queryObj.requestType = "Range";
            } else {
                queryObj.requestType = "Date";
            }
            if (this.state.queryCategory) {
                queryObj.reportCategory = this.state.selectedCate.toString();
            }
            if (this.state.selected === 0) {
                queryObj.reportDate = formatDate(this.state.date1);
            } else if (this.state.selected === 2) {
                if (this.state.queryRange !== -1) {
                    let tempDate = new Date();
                    tempDate.setDate(tempDate.getDate() - this.state.queryRange);
                    queryObj.startDate = formatDate(tempDate);
                } else {
                    queryObj.startDate = null;
                }
                queryObj.endDate = formatDate(new Date());
            } else {
                queryObj.startDate = formatDate(this.state.date1);
                queryObj.endDate = formatDate(this.state.date2);
            }
            axios.get("./queryReports" + this.formatParams(queryObj)).then((data) => {
                const passData = data.data;
                this.setState({
                    isLoading: false,
                    isResult: true,
                    queryData: passData
                });
            });
        });
    }

    endQuery = () => {
        this.setState({
            isResult: false
        });
    }

    formatParams = (params) => {
        return "?" + Object
            .keys(params)
            .map(function(key) {
                return key + "=" + params[key]
            })
            .join("&");
    }

    componentDidMount() {
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
        this._isMounted = false;
    }

    render() {
        const dateRangeOptions = [
            {
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
        ];
        const curDate = new Date();
        const singleDate = <div>
            <DatePicker curDate={curDate} position={"txtbox"} dayChanged={this.date1Change} disabledDate={curDate}></DatePicker>
        </div>
        const dateRange = <div>
            <DatePicker curDate={this.state.date1} position={"txtbox"} dayChanged={(date) => {this.date1Change(date)}} disabledDate={this.state.date2}></DatePicker>
            <span style={{paddingLeft: "10px", paddingRight: "10px"}}>to:</span>
            <DatePicker curDate={this.state.date2} position={"txtbox"} dayChanged={(date) => {this.date2Change(date)}} disabledDate={curDate}></DatePicker>
        </div>
        const dateDropdown = <div>
            <Dropdown placeholder="Select date ranges" selection options={dateRangeOptions} defaultValue={this.state.queryRange} onChange={(event, data) => {this.rangeChange(data)}}></Dropdown>
        </div>
        const inlineStyle1 = {
            display: "block",
            width: "80%",
            maxWidth: "1200px",
            margin: "auto"
        }, inlineStyle2 = {
            paddingLeft: "0",
            width: "250px"
        }, inlineStyle3 = {
            paddingBottom: "0"
        }, inlineStyle4 = { 
            paddingTop: "0",
            paddingBottom: "0"
        }

        const queryPanel = (<Grid style={inlineStyle1}>
            <Grid.Row columns={2} divided style={inlineStyle3}>
                <Grid.Column style={inlineStyle2} >
                    <Button.Group vertical labeled icon>
                        <Button basic icon="calendar check" className={classes.switchButton} content="On Day" active={this.state.selected === 0} onClick={() => this.switchDateRange(0)}></Button>
                        <Button basic icon="calendar alternate" className={classes.switchButton} content="Between Day" active={this.state.selected === 1} onClick={() => this.switchDateRange(1)}></Button>
                        <Button basic icon="hourglass" className={classes.switchButton} content="Within" active={this.state.selected === 2} onClick={() => this.switchDateRange(2)}></Button>
                    </Button.Group>
                </Grid.Column>
                <Grid.Column>
                    {this.state.selected === 0 ? singleDate : (this.state.selected === 1 ? dateRange : dateDropdown)}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2} divided style={inlineStyle4}>
                <Grid.Column style={inlineStyle2}>
                    <input id="cateCheck" type="checkbox" className={classes.checkbox} checked={this.state.queryCategory} onChange={this.toggleCateQuery} style={{margin: "auto 10px auto 0", display: "inline-block", paddingTop: "10px"}}></input>
                    <label htmlFor="cateCheck" style={{margin: "auto 10px auto 0", display: "inline-block", paddingTop: "10px"}}>Search within category:</label>
                </Grid.Column>
                <Grid.Column>
                    <Dropdown search multiple selection options={this.state.idRef} placeholder="Select Category" disabled={!this.state.queryCategory} onChange={(event, data) => {this.cateSelChange(event, data)}}></Dropdown>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2} divided style={inlineStyle4}>
                <Grid.Column style={inlineStyle2}>
                    <label style={{display: "inline-block", paddingTop: "10px"}}>Choose Environemnt: </label>
                </Grid.Column>
                <Grid.Column>
                    <div className={classes.envirContainer}>
                        <input id="envir1" type="checkbox" className={classes.checkbox} checked={this.state.queryEnvir.envir1} onChange={() => {this.tooglEnvir("envir1")}}></input>
                        <label htmlFor="envir1" className={classes.envirLabel}>Envir1</label>
                        <input id="envir2" type="checkbox" className={classes.checkbox} checked={this.state.queryEnvir.envir2} onChange={() => {this.tooglEnvir("envir2")}}></input>
                        <label htmlFor="envir2"  className={classes.envirLabel}>Envir2</label>
                        <input id="envir3" type="checkbox" className={classes.checkbox} checked={this.state.queryEnvir.envir3} onChange={() => {this.tooglEnvir("envir3")}}></input>
                        <label htmlFor="envir3"  className={classes.envirLabel}>Envir3</label>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <button className={classes.backButton}>Back</button>
                <button className={classes.applyBut} disabled={!this.state.queryReady} onClick={() => {this.startQuery()}}>Query</button>
            </Grid.Row>
        </Grid>)

        const resultPanel = <div>
            <button onClick={() => {this.endQuery()}} className={classes.backButton} style={{margin: "10px auto 30px auto", display: "block"}}>Back</button>
            <QueryChart data={this.state.queryData} browserName={this.state.browserName}></QueryChart>
        </div>

        const loadingPanel = <Loader active inline="centered" size="massive" style={{transform:"translateY(90%)"}}>Loading</Loader>;

        return (
            <>
                {this.state.isResult ? (this.state.isLoading ? loadingPanel : resultPanel) : queryPanel}
            </>
        )
    }
}

export default QueryPane;