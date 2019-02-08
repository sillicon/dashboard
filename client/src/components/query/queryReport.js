import React, {
    Component
} from "react";
import {
    Button, Checkbox, Form, Input, Radio, Select, TextArea, Dropdown
} from "semantic-ui-react";
import DatePicker from "../datepicker/datepicker";

class QueryPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    switchDateRange = (num) => {
        this.setState({
            selected: num
        });
    }

    render() {
        const singleDate = <div>
            <DatePicker></DatePicker>
        </div>
        const dateRange = <div>
            <DatePicker></DatePicker>
            <span>to:</span>
            <DatePicker></DatePicker>
        </div>
        const dateDropdown = <div><Dropdown placeholder="Select date ranges" selection options={[]}></Dropdown></div>

        return (
            <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Button.Group vertical labeled icon>
                            <Button icon="calendar check" content="On Day" active={this.state.selected === 0} onClick={() => this.switchDateRange(0)}></Button>
                            <Button icon="calendar alternate" content="Between Day" active={this.state.selected === 1} onClick={() => this.switchDateRange(1)}></Button>
                            <Button icon="hourglass" content="Within" active={this.state.selected === 2} onClick={() => this.switchDateRange(2)}></Button>
                        </Button.Group>
                        {/* <Form.Field control={Input} label='First name' placeholder='First name' />
                        <Form.Field control={Input} label='Last name' placeholder='Last name' />
                        <Form.Field control={Select} label='Gender' options={options} placeholder='Gender' /> */}
                        {this.state.selected === 0 ? singleDate : (this.state.selected === 1 ? dateRange : dateDropdown)}
                    </Form.Group>
                    <Form.Group inline>
                        <label>Quantity</label>
                        {/* <Form.Field
                            control={Radio}
                            label='One'
                            value='1'
                            checked={value === '1'}
                            onChange={this.handleChange}
                        />
                        <Form.Field
                            control={Radio}
                            label='Two'
                            value='2'
                            checked={value === '2'}
                            onChange={this.handleChange}
                        />
                        <Form.Field
                            control={Radio}
                            label='Three'
                            value='3'
                            checked={value === '3'}
                            onChange={this.handleChange}
                        /> */}
                    </Form.Group>
                    <Form.Field control={TextArea} label='About' placeholder='Tell us more about you...' />
                    <Form.Field control={Checkbox} label='I agree to the Terms and Conditions' />
                    <Form.Field control={Button}>Submit</Form.Field>
                </Form>
                
            </div>
        )
    }
}

export default QueryPane;