import React, {
    Component
} from "react";
import {
    Button,
    Checkbox,
    Form,
    Input,
    Radio,
    Select,
    TextArea,
    Dropdown,
    Label
} from "semantic-ui-react";
import axios from "axios";
import DatePicker from "../datepicker/datepicker";

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

    switchDateRange = (num) => {
        this.setState({
            selected: num
        });
    }

    toggleCateQuery = () => {
        console.log(this.state.queryCategory)
        this.setState({
            queryCategory: !this.state.queryCategory
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
        this._isMounted = true;
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
            <span>to:</span>
            <DatePicker curDate={this.state.date2} position={"txtbox"} dayChanged={this.date2Change} disabledDate={curDate}></DatePicker>
        </div>
        const dateDropdown = <div><Dropdown placeholder="Select date ranges" selection options={dateRangeOptions} defaultValue={3}></Dropdown></div>

        return (
            <div>
                <Button.Group vertical labeled icon>
                    <Button icon="calendar check" content="On Day" active={this.state.selected === 0} onClick={() => this.switchDateRange(0)}></Button>
                    <Button icon="calendar alternate" content="Between Day" active={this.state.selected === 1} onClick={() => this.switchDateRange(1)}></Button>
                    <Button icon="hourglass" content="Within" active={this.state.selected === 2} onClick={() => this.switchDateRange(2)}></Button>
                </Button.Group>
                {this.state.selected === 0 ? singleDate : (this.state.selected === 1 ? dateRange : dateDropdown)}
                <input type="checkbox" checked={this.state.queryCategory} onChange={this.toggleCateQuery}></input>
                <label>Search within a certain category:</label>
                <Dropdown options={this.state.idRef}></Dropdown>
            </div>
        )
    }
}

export default QueryPane;