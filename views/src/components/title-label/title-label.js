import React from 'react';
import './title-label.css';

export class TitleLabel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
    return (
        <h3 class="title-label">
            {this.props.label}
        </h3>
    );
    }
}