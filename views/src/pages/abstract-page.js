import React from "react";

export class AbstractPage extends React.Component {
    constructor(props) {
        super(props);
    }

    saveInfo(stateKey, namePrefix) {
        return function(event) {
            let state = this.state;
            let index = event.target.name.replace(namePrefix, "");
            state[stateKey][index] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
            this.setState(state);
        }.bind((this));
    }
}