import React from "react";

/**
 * テキスト入力のフォームクラス
 */
export class InputText extends React.Component {
    DEFAULT_TEXT_LENGTH = 255;

    constructor(props) {
        super(props);
        this.id = props.id;
        if (typeof props.name !== "string" || props.name.length < 1) {
            this.name = props.id;
        } else {
            this.name = props.name;
        }
        if (typeof this.props.maxLength !== "string" && typeof this.props.maxLength !== "number") {
            this.maxLength = this.DEFAULT_TEXT_LENGTH;
        } else {
            this.maxLength = props.maxLength;
        }
        this.state = { callback : this.props.callback};
        this.value = props.value ?? "";
        this.bindValue = this.bindValue.bind(this);
    }

    bindValue(event) {
        this.state.callback(this.id, event.target.value);
        this.value = event.target.value;
    }

    render() {
        return (
            <input
                type="text"
                onChange={( event ) => { this.bindValue(event); }}
                class="form-control"
                id={this.id}
                name={this.name}
                maxLength={this.maxLength}
                value={this.value}
            />
        );
    }
}
