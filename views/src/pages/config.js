import React, {useRef} from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {InputText} from "../components/input-text/input-text";
import {Message} from "../components/message/message";

export class Config extends React.Component {
    constructor(props) {
        super(props);
        const savedConfigInfo = window.electronAPI.loadConfig();
        let defaultConfigInfo = {
            basicAuthUserId: "",
            basicAuthPassWord: "",
            redmineUri: "",
            redmineAccessToken: "",
            gasGetUserListAPIEndPoint: "",
            gasPostScheduleAPIEndPoint: "",
            gasPostScheduleAPIAccessToken: "",
            gasPostScheduleAPIProjectFolderId: "",
            gasPostScheduleAPITemplateProjectFolderId: "",
            gasPostResultAPIEndPoint: "",
            gasPostResultAPIAccessToken: "",
            slackMailAddressForRequestToMember: "",
            slackMailAddressForNoticeToCS: "",
            platformAPIAccessToken: ""
        };
        for (let key in savedConfigInfo) {
            defaultConfigInfo[key] = savedConfigInfo[key];
        }
        this.state = defaultConfigInfo;
        this.getInputTextValue = this.getInputTextValue.bind(this);
    }

    //stateのcountの値を更新するコールバック関数
    getInputTextValue( name, value ){
        let state = {};
        state[name] = value;
        console.log(state);
        this.setState(state);
    }

    async send() {
        await window.electronAPI.saveConfig(this.state);
    }

    render() {
        return (
            <div class="content-main">
                <TitleLabel label="設定" />
                <SectionLabel label="BASIC認証" />
                <table className="table mgr-tbl">
                    <tbody>
                    <tr>
                        <th>
                            ユーザID
                        </th>
                        <td>
                            <InputText id="basicAuthUserId" callback={this.getInputTextValue} value={this.state.basicAuthUserId}/>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            パスワード
                        </th>
                        <td>
                            <InputText id="basicAuthPassWord" callback={this.getInputTextValue} value={this.state.basicAuthPassWord}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <SectionLabel label="Redmine連携設定" />
                <table className="table mgr-tbl">
                    <tbody>
                    <tr>
                        <th>
                            Redmine URI
                        </th>
                        <td>
                            <InputText id="redmineUri" callback={this.getInputTextValue} value={this.state.redmineUri} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Redmine API<br />アクセストークン
                        </th>
                        <td>
                            <InputText id="redmineAccessToken" callback={this.getInputTextValue} value={this.state.redmineAccessToken} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <SectionLabel label="GAS連携設定" />
                <table className="table mgr-tbl">
                    <tbody>
                    <tr>
                        <th>
                            GASユーザ情報取得API<br />エンドポイントURL
                        </th>
                        <td>
                            <InputText id="gasGetUserListAPIEndPoint" callback={this.getInputTextValue} value={this.state.gasGetUserListAPIEndPoint} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />エンドポイントURL
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPIEndPoint" callback={this.getInputTextValue} value={this.state.gasPostScheduleAPIEndPoint} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />アクセストークン
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPIAccessToken" callback={this.getInputTextValue} value={this.state.gasPostScheduleAPIAccessToken} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />PJフォルダ作成先フォルダID
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPIProjectFolderId" callback={this.getInputTextValue} value={this.state.gasPostScheduleAPIProjectFolderId} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />PJフォルダテンプレートフォルダID
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPITemplateProjectFolderId" callback={this.getInputTextValue} value={this.state.gasPostScheduleAPITemplateProjectFolderId} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GAS振り返り資料生成API<br />エンドポイントURL
                        </th>
                        <td>
                            <InputText id="gasPostResultAPIEndPoint" callback={this.getInputTextValue} value={this.state.gasPostResultAPIEndPoint} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GAS振り返り資料生成API<br />アクセストークン
                        </th>
                        <td>
                            <InputText id="gasPostResultAPIAccessToken" callback={this.getInputTextValue} value={this.state.gasPostResultAPIAccessToken} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <SectionLabel label="Slack連携設定" />
                <table className="table mgr-tbl">
                    <tbody>
                    <tr>
                        <th>
                            記載依頼投稿先Slack<br />メールアドレス
                        </th>
                        <td>
                            <InputText id="slackMailAddressForRequestToMember" callback={this.getInputTextValue} value={this.state.slackMailAddressForRequestToMember} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            リリース完了連絡先Slack<br />メールアドレス
                        </th>
                        <td>
                            <InputText id="slackMailAddressForNoticeToCS" callback={this.getInputTextValue} value={this.state.slackMailAddressForNoticeToCS} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <SectionLabel label="スマレジ タイムカード連携設定" />
                <table className="table mgr-tbl">
                    <tbody>
                    <tr>
                        <th>
                            プラットフォームAPI<br />アクセストークン
                        </th>
                        <td>
                            <InputText id="platformAPIAccessToken" callback={this.getInputTextValue} value={this.state.platformAPIAccessToken} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button className="btn btn-outline-primary" onClick={() => this.send()}>登録</button>
                <Message message="設定しました。" id="fine"></Message>
            </div>
        );
    }
}