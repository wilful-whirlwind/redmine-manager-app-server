import React from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {InputText} from "../components/input-text/input-text";

export class ListTask extends React.Component {
    constructor(props) {
        super(props);
        this.getInputTextValue = this.getInputTextValue.bind(this);
        this.setInputValue = this.setInputValue.bind(this);
        this.getTaskListByVersionNumber = this.getTaskListByVersionNumber.bind(this);
        this.bindValue = this.bindValue.bind(this);

        this.state = {
            callback: this.props.callback,
            taskList: []
        };
    }
    bindValue(event) {
        event.preventDefault();
        this.state.callback("task_id", event.target.href.replace("file:///", ""));
    }

    //stateのcountの値を更新するコールバック関数
    getInputTextValue( name, value ){
        let state = [];
        state[name] = value;
        this.setState(state);
    }

    getVersionInfo() {
        let versionInfo = {};
        versionInfo.majorVersion = this.state.majorVersion;
        versionInfo.minorVersion = this.state.minorVersion;
        versionInfo.maintenanceVersion = this.state.maintenanceVersion;
        return versionInfo;
    }

     getTaskListByVersionNumber() {
        const result = window.electronAPI.getTaskListByVersionNumber(this.getVersionInfo());
        if (
            result?.status !== "success" ||
            !Array.isArray(result?.taskList)
        ) {
            alert("タスクリストの取得に失敗しました。");
        }
        this.getInputTextValue("taskList", result.taskList);
    }

    renderTaskListTable() {
        const rows = this.state.taskList.map((task) =>
            <tr key={task.id}>
                <td>
                    <a className="btn btn-link" href={task.url}>#{task.id}</a>
                </td>
                <td>
                    {task.subject}
                </td>
                <td>
                    {task.pic}
                </td>
                <td>
                    {task.deadLine}
                </td>

                <td>
                    {task.status.name}
                </td>
            </tr>
        );

        return (
            <table className="table mgr-tbl" id="task-list">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>PiC</th>
                    <th>DeadLine</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        )
    }

    setInputValue(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state);
    }

    renderForm() {
        return (
            <table className="table mgr-tbl">
                <thead>
                <tr>
                    <th scope="col">Major</th>
                    <th scope="col">Miner</th>
                    <th scope="col">Maintenance</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <InputText id="majorVersion" callback={this.setInputValue} />
                    </td>
                    <td>
                        <InputText id="minorVersion" callback={this.setInputValue} />
                    </td>
                    <td>
                        <InputText id="maintenanceVersion" callback={this.setInputValue} />
                    </td>
                </tr>
                <tr>
                    <td>
                        <button type="button" className="btn btn-outline-secondary" onClick={this.getTaskListByVersionNumber}>
                            タスクリストの取得
                        </button>
                    </td>
                    <td>
                        <a href={"0"} className="btn btn-outline-secondary" onClick={this.bindValue}>
                            タスクの追加
                        </a>
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
                {this.renderForm()}
                {this.renderTaskListTable()}
            </div>
        );
    }
}