import React, {useRef} from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {Message} from "../components/message/message";
import {Link, useNavigate} from "react-router-dom";

export class ListRedmineVersion extends React.Component {
    constructor(props) {
        super(props);
        const versionList = window.electronAPI.getRedmineVersionList();
        console.log(versionList);
        this.redmineVersionList = versionList.redmineVersionList ?? [];
        this.getInputTextValue = this.getInputTextValue.bind(this);
        this.send = this.send.bind(this);
        this.bindValue = this.bindValue.bind(this);
        this.state = {callback: this.props.callback};
    }

    bindValue(event) {
        event.preventDefault();
        this.state.callback("id", event.target.href.replace("file:///", ""));
    }

    //stateのcountの値を更新するコールバック関数
    getInputTextValue( name, value ){
        let state = {};
        state[name] = value;
        this.setState(state) ;
    }
    async send() {
        await window.electronAPI.initializeVersion(this.state);
    }

    renderVersionTable() {
        const rows = this.redmineVersionList.map((redmineVersion,index) =>
            <tr key={redmineVersion.id}>
                <td>
                    <div>
                        <a href={redmineVersion.id} class="nav-link text-black rounded" onClick={this.bindValue}>
                            {redmineVersion.name}
                        </a>
                    </div>
                </td>
                <td>
                    {redmineVersion.status}
                </td>
                <td>
                    <a class="btn btn-link" href={redmineVersion.url}>リンク</a>
                </td>
            </tr>
        );

        return (
            <table class="table mgr-tbl">
                <thead>
                <tr>
                    <th>バージョン名</th>
                    <th>ステータス</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <div class="content-main">
                <TitleLabel label="バージョン" />
                <SectionLabel label="バージョン一覧" />
                {this.renderVersionTable()}
            </div>
        );
    }
}