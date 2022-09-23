import React, {useRef} from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {InputText} from "../components/input-text/input-text";
import {Message} from "../components/message/message";

export class Config extends React.Component {
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
                            <InputText id="basicAuthUserId" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            パスワード
                        </th>
                        <td>
                            <InputText id="basicAuthPassWord" callback={this.getInputTextValue} />
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
                            <InputText id="redmineUri" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Redmine API<br />アクセストークン
                        </th>
                        <td>
                            <InputText id="redmineAccessToken" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <SectionLabel label="GAS連携設定" />
                <table className="table mgr-tbl">
                    <tbody>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />エンドポイントURL
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPIEndPoint" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />アクセストークン
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPIAccessToken" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />PJフォルダ作成先フォルダID
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPIProjectFolderId" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GASスケジュール登録API<br />PJフォルダテンプレートフォルダID
                        </th>
                        <td>
                            <InputText id="gasPostScheduleAPITemplateProjectFolderId" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GAS振り返り資料生成API<br />エンドポイントURL
                        </th>
                        <td>
                            <InputText id="gasPostResultAPIEndPoint" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            GAS振り返り資料生成API<br />アクセストークン
                        </th>
                        <td>
                            <InputText id="gasPostResultAPIAccessToken" callback={this.getInputTextValue} />
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
                            <InputText id="slackMailAddressForRequestToMember" callback={this.getInputTextValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            リリース完了連絡先Slack<br />メールアドレス
                        </th>
                        <td>
                            <InputText id="slackMailAddressForNoticeToCS" callback={this.getInputTextValue} />
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
                            <InputText id="platformAPIAccessToken" callback={this.getInputTextValue} />
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