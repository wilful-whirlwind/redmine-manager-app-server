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
        console.log("in const");
    }

    bindValue(props) {
        console.log(this.props);
        console.log(this.state);
        console.log(props);
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
        console.log("in render");
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
                                    <p className="modal_title2">モーダル の中身を表示</p>
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