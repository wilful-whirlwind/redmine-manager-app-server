import React from 'react';
import './message.css';

export class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.message = props.message;
        this.state.id = props.id;
        this.state.visible = props.visible;
        this.state.className = "modal_overlay2";
        this.bindValue = this.bindValue.bind(this);
        this.toggleVisible = this.toggleVisible.bind(this);
    }

    bindValue(props) {
        this.state = props;
        this.setState(props);
    }
    toggleVisible() {
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <>
                {
                    this.state.visible ? (
                        <div className="modal_wrap" id={this.state.id}>
                            <input id="trigger" type="checkbox" checked={this.state.visible}/>
                            <div class={this.state.className}>
                                <label htmlFor="trigger" className="modal_trigger"></label>
                                <div className="modal_content">
                                    <label htmlFor="trigger" className="close_button" onClick={this.toggleVisible}>✖️</label>
                                    <p>{this.state.message}</p>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)
                }
            </>
        );
    }
}