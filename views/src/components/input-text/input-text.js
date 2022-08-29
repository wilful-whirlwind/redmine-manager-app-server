import React from "react";

/**
 * テキスト入力のフォームクラス
 */
export class InputText extends React.Component {
    DEFAULT_TEXT_LENGTH = 16;

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
    }

    render() {
        return (
            <input type="text" class="form-control" id={this.id} name={this.name} maxLength={this.maxLength} />
        );
    }
}
