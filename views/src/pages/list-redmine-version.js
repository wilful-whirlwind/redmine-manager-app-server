import React, {useRef} from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {Message} from "../components/message/message";
import {Link, useNavigate} from "react-router-dom";
import {InputText} from "../components/input-text/input-text";

export class ListRedmineVersion extends React.Component {
    constructor(props) {
        super(props);
        const versionList = window.electronAPI.getRedmineVersionList();
        this.props.redmineVersionList = versionList.redmineVersionList ?? [];
        this.getInputTextValue = this.getInputTextValue.bind(this);
        this.send = this.send.bind(this);
        this.bindValue = this.bindValue.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
        this.toggleShowOpen = this.toggleShowOpen.bind(this);
        this.toggleShowClosed = this.toggleShowClosed.bind(this);
        let showStyleList = [];
        for (let i = 0; i < this.props.redmineVersionList.length; i++) {
            if (this.props.redmineVersionList[i].status === "open") {
                showStyleList[ this.props.redmineVersionList[i].id] = "show";
            } else {
                showStyleList[ this.props.redmineVersionList[i].id] = "hide";
            }
        }

        this.state = {
            callback: this.props.callback,
            showStyleList: showStyleList,
            openIsChecked: true,
            closedIsChecked: false
        };
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
        const rows = this.props.redmineVersionList.map((redmineVersion,index) =>
            <tr key={redmineVersion.id} className={this.state.showStyleList[redmineVersion.id]}>
                <td>
                    <div>
                        <a href={redmineVersion.id} className="nav-link text-black rounded" onClick={this.bindValue}>
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
            <table className="table mgr-tbl">
                <thead>
                <tr>
                    <th>バージョン名</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        )
    }

    toggleShow(status, flag) {
        console.log(this.state.openIsChecked);
        let showStyleList = [];
        for (let i = 0; i < this.props.redmineVersionList.length; i++) {
            if (this.props.redmineVersionList[i].status === status) {
                showStyleList[this.props.redmineVersionList[i].id] = flag ? "show" : "hide";
            } else {
                showStyleList[this.props.redmineVersionList[i].id] = this.state.showStyleList[this.props.redmineVersionList[i].id];
            }
        }
        this.setState({
            showStyleList: showStyleList
        });
    }

    toggleShowOpen() {
        console.log(this.state.openIsChecked);
        this.setState({
            openIsChecked: !this.state.openIsChecked
        });
        this.toggleShow("open", !this.state.openIsChecked);
    }

    toggleShowClosed() {
        this.setState({
            closedIsChecked: !this.state.closedIsChecked
        });
        this.toggleShow("closed", !this.state.closedIsChecked);
    }

    renderForm() {
        return (
            <div className="form">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="open" checked={this.state.openIsChecked} onChange={this.toggleShowOpen}/>
                    <label className="form-check-label" htmlFor="open">
                        open
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="closed" checked={this.state.closedIsChecked} onChange={this.toggleShowClosed}/>
                    <label className="form-check-label" htmlFor="closed">
                        closed
                    </label>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="content-main">
                <TitleLabel label="バージョン" />
                <SectionLabel label="バージョン一覧" />
                {this.renderForm()}
                {this.renderVersionTable()}
            </div>
        );
    }
}