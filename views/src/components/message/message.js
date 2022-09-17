import React from 'react';

export class Message extends React.Component {
    constructor(props) {
        super(props);
        this.message = props.message;
        this.id = props.id;
    }
    render() {
        return (
            <div className="modal fade" id={this.id} tabIndex="-1" aria-labelledby="messageLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="messageLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {this.message}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}