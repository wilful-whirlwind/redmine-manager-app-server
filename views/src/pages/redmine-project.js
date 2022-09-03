import React, {useRef} from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {InputText} from "../components/input-text/input-text";

export class RedmineProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            majorVersion: "",
            minorVersion: "",
            maintenanceVersion: "",
            developmentPeriodFrom: "",
            developmentPeriodTo: "",
            qaPeriodFrom: "",
            qaPeriodTo: "",
            releaseDate: ""
        }
        this.getInputTextValue = this.getInputTextValue.bind(this);
    }

    //stateのcountの値を更新するコールバック関数
    getInputTextValue( name, value ){
        let state = {};
        state[name] = value;
        this.setState(state) ;
    }
    async send() {
        await window.electronAPI.openFile(this.state);
    }
    render() {
        return (
            <div class="content-main">
                <TitleLabel label="プロジェクトチケットの生成" />
                <SectionLabel label="バージョン番号" />
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
                            <InputText id="majorVersion" callback={this.getInputTextValue} />
                        </td>
                        <td>
                            <InputText id="minorVersion" callback={this.getInputTextValue} />
                        </td>
                        <td>
                            <InputText id="maintenanceVersion" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <SectionLabel label="スケジュール" />
                <table className="table mgr-tbl">
                    <tbody>
                    <tr>
                        <th>
                            開発期間
                        </th>
                        <td>
                            <InputText id="developmentPeriodFrom" callback={this.getInputTextValue} />
                        </td>
                        <td>
                            ~
                        </td>
                        <td>
                            <InputText id="developmentPeriodTo" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            QA期間
                        </th>
                        <td>
                            <InputText id="qaPeriodFrom" callback={this.getInputTextValue} />
                        </td>
                        <td>
                            ~
                        </td>
                        <td>
                            <InputText id="qaPeriodTo" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            リリース日
                        </th>
                        <td>
                            <InputText id="releaseDate" callback={this.getInputTextValue} />
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button class="btn btn-outline-primary" onClick={() => this.send()}>バージョン生成</button>
            </div>
        );
    }
}