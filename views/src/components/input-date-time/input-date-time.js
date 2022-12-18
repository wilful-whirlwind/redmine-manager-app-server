import React from 'react';
import './inpute-date-time.css';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export class InputDateTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.message = props.message;
        this.state.id = props.id;
        this.bindValue = this.bindValue.bind(this);
        this.toggleVisible = this.toggleVisible.bind(this);
    }

    bindValue(props) {
        this.state = props;
        this.setState(props);
        console.log("in bind");
    }

    toggleVisible() {
        this.setState({
            visible: false
        })
    }

    render() {
        const date = new Date();
        return (
            <>
           </>
        );
    }
}