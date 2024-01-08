import React from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {InputText} from "../components/input-text/input-text";
import {SectionLabel} from "../components/section-label/section-label";
import {AbstractPage} from "./abstract-page";

export class CreateTask extends AbstractPage {
    constructor(props) {
        super(props);
        this.getInputTextValue = this.getInputTextValue.bind(this);
        this.saveInfo = this.saveInfo.bind(this);
        this.createTaskSet = this.createTaskSet.bind(this);
        this.toggleCheckBox = this.toggleCheckBox.bind(this);
        const trackerListFromRedmine = window.electronAPI.getTrackerList();
        const versionListFromRedmine = window.electronAPI.getRedmineVersionList();
        let trackerList = [];
        let versionList = [];
        if (trackerListFromRedmine.status !== "success") {
            alert("トラッカー情報の読み込みに失敗しました。");
            return;
        } else {
            trackerList = trackerListFromRedmine.redmineTrackerList;
        }
        if (versionListFromRedmine.status !== "success") {
            alert("バージョン情報の読み込みに失敗しました。");
            return;
        } else if (versionListFromRedmine.redmineVersionList.length < 1) {
            alert("redmineにバージョン情報が設定されていません。");
            return;
        } else {
            versionList = versionListFromRedmine.redmineVersionList;
        }
        let subTitle;
        let taskName = "";
        let trackerId = trackerList[0].id;
        let versionId = versionList[0].id;
        if (this.props.id < 1) {
            subTitle = "タスクの追加";
        } else {
            subTitle = "タスクの更新";
        }
        this.state = {
            callback: this.props.callback,
            versionList: versionList,
            trackerList: trackerList,
            subTitle: subTitle,
            documentLink: "",
            pullRequestLink: "",
            testDocumentLink: "",
            createInfo: {
                phase_plan: false,
                phase_development: true,
                phase_test: true,
                task_name: taskName,
                tracker_id: trackerId,
                version_id: versionId
            },
            taskList: []
        };
    }

    getInputTextValue( name, value ){
        let state = this.state;
        state.createInfo[name] = value;
        this.setState(state);
    }

    createTaskSet() {
        console.log(this.state.createInfo);
        window.electronAPI.saveTask(this.state.createInfo);
    }

    renderTrackerSelectBox() {
        const options = this.state.trackerList.map(function (tracker){
            return (<option value={tracker.id} selected={this.state.createInfo.tracker_id === tracker.id}>{tracker.name}</option>);
        }.bind(this));

        return (<select name="tracker_id" className="form-select" onClick={this.saveInfo("createInfo", "")}>{options}</select>);
    }

    renderVersionSelectBox() {
        const options = this.state.versionList.map(function (version){
            return (<option value={version.id} selected={this.state.createInfo.version_id === version.id}>{version.name}</option>);
        }.bind(this));

        return (<select name="version_id" className="form-select" onClick={this.saveInfo("createInfo", "")}>{options}</select>);
    }

    toggleCheckBox(event) {
        this.state.createInfo[event.target.name] = !this.state.createInfo[event.target.name];
    }

    renderIncludeTaskCheckBox() {
        let documentLink = null;
        if (this.state.documentLink.length > 0) {
            documentLink = (<a href="" style={{marginLeft: "10px"}}>リンク</a>);
        }
        let pullRequestLink = null;
        if (this.state.pullRequestLink.length > 0) {
            pullRequestLink = (<a href="" style={{marginLeft: "10px"}}>リンク</a>);
        }
        let testDocumentLink = null;
        if (this.state.testDocumentLink.length > 0) {
            testDocumentLink = (<a href="" style={{marginLeft: "10px"}}>リンク</a>);
        }
        return (
            <ul className={"no-itemize"}>
                <li>
                    <input type="checkbox" name="phase_plan" defaultChecked={this.state.createInfo.phase_plan} onChange={this.toggleCheckBox}/><label>設計</label>{documentLink}
                </li>
                <li>
                    <input type="checkbox" name="phase_development" defaultChecked={this.state.createInfo.phase_development} onChange={this.toggleCheckBox}/><label>実装</label>{pullRequestLink}
                </li>
                <li>
                    <input type="checkbox" name="phase_test" defaultChecked={this.state.createInfo.phase_test} onChange={this.toggleCheckBox}/><label>テスト</label>{testDocumentLink}
                </li>
            </ul>
        );
    }

    renderForm() {
        return (
            <table className="table mgr-tbl">
                <tbody>
                    <tr>
                        <th>
                            <label>タスク名</label>
                        </th>
                        <td>
                            <InputText id="task_name" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label>バージョン</label>
                        </th>
                        <td>
                            {this.renderVersionSelectBox()}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label>トラッカー</label>
                        </th>
                        <td>
                            {this.renderTrackerSelectBox()}
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <label>発生するフェーズ</label>
                        </th>
                        <td>
                            {this.renderIncludeTaskCheckBox()}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button type="button" className="btn btn-outline-secondary" onClick={this.createTaskSet}>
                                登録
                            </button>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <div className="content-main">
                <TitleLabel label="タスク" />
                <SectionLabel label={this.state.subTitle} />
                {this.renderForm()}
            </div>
        );
    }
}