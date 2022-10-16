import React, {useState} from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {InputText} from "../components/input-text/input-text";
import {Message} from "../components/message/message";

export class EditRedmineVersion extends React.Component {
    constructor(props) {
        super(props);
        console.log(this);
        this.state = {
            "versionTicketInfo": "",
        }
        this.getInputTextValue = this.getInputTextValue.bind(this);
        this.createVersionInfo = this.createVersionInfo.bind(this);
        this.childRef = React.createRef();
    }

    //stateのcountの値を更新するコールバック関数
    getInputTextValue( name, value ){
        let state = {};
        state[name] = value;
        this.setState(state);
    }
    async createVersionInfo() {
        const result = await window.electronAPI.createVersionInfo(this.props.id);
        const state = this.state;
        state.versionTicketInfo = result.versionInfo;
        this.setState(state);
        if (result.status === "failed") {
            this.showModal(result.message);
        }
    }
    showModal(message) {
        this.childRef.current.bindValue(
            {
                message: message,
                visible: true,
                className: "modal_overlay"
            }
        );
    }
    render() {
        return (
            <div class="content-main">
                <TitleLabel label="プロジェクトチケットの編集" />
                <SectionLabel label="プロジェクトチケットの記載" />
                <button class="btn btn-outline-primary" onClick={() => this.createVersionInfo()}>バージョン情報取得</button>
                <textarea contentEditable={false} value={this.state.versionTicketInfo}></textarea>
                <Message ref={this.childRef} message={""} id="targetModal" visible={false}></Message>
            </div>
        );
    }
}