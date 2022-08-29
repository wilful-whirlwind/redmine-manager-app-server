import React from 'react';
import './section-label.css';

export class SectionLabel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
    return (
        <h5 class="section-label">
            {this.props.label}
        </h5>
    );
    }
}