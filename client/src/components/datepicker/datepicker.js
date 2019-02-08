import React from "react";
import {
    formatDate,
    parseDate,
} from 'react-day-picker/moment';
import DayPicker from "react-day-picker";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import classes from "./datepicker.module.css";

const dayPickerInputClassNames = { ...DayPickerInput.defaultProps.classNames };
const dayPickerClassNames = { ...DayPicker.defaultProps.classNames };
for (const key in dayPickerInputClassNames) {
    if (dayPickerInputClassNames.hasOwnProperty(key)) {
        dayPickerInputClassNames[key] = classes[dayPickerInputClassNames[key]];
    }
}
for (const key in dayPickerClassNames) {
    if (dayPickerClassNames.hasOwnProperty(key)) {
        dayPickerClassNames[key] = classes[dayPickerClassNames[key]];
    }
}

const datePicker = (props) => {
    return <DayPickerInput
        classNames={dayPickerInputClassNames}
        formatDate={formatDate}
        parseDate={parseDate}
        placeholder={formatDate(props.curDate)} 
        dayPickerProps={{
            month: props.curDate,
            todayButton: "Today",
            selectedDays: props.curDate,
            disabledDays: {
                after: new Date()
            },
            classNames: {
                ...dayPickerClassNames,
                navButtonNext: [classes["DayPicker-NavButton"], classes["DayPicker-NavButton--next"]].join(" "),
                navButtonPrev: [classes["DayPicker-NavButton"], classes["DayPicker-NavButton--prev"]].join(" "),
                disabled: classes["DayPicker-Day--disabled"],
                outside: classes["DayPicker-Day--outside"],
                selected: classes["DayPicker-Day--selected"],
                today: classes["DayPicker-Day--today"]
            }
        }}
        onDayChange={props.queryChange}>
    </DayPickerInput>
}

export default datePicker;