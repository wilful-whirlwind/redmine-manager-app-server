import React from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {InputText} from "../components/input-text/input-text";

export class RedmineProject extends React.Component {
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
                            <InputText id="major-version" />
                        </td>
                        <td>
                            <InputText id="minor-version" />
                        </td>
                        <td>
                            <InputText id="maintenance-version" />
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
                            <InputText id="development-period-from" />
                        </td>
                        <td>
                            ~
                        </td>
                        <td>
                            <InputText id="development-period-to" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            QA期間
                        </th>
                        <td>
                            <InputText id="qa-period-from" />
                        </td>
                        <td>
                            ~
                        </td>
                        <td>
                            <InputText id="qa-period-to" />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            リリース日
                        </th>
                        <td>
                            <InputText id="release-date" />
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}