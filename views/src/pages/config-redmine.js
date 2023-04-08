import React from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {Message} from "../components/message/message";

export class ConfigRedmine extends React.Component {
    constructor(props) {
        super(props);
        const redmineConfig = window.electronAPI.getRedmineTrackerList();
        console.log(redmineConfig);
        this.redmineTrackerList = redmineConfig.redmineTrackerList ?? [];
        this.state = {};

        this.saveInfo = this.saveInfo.bind(this);
        this.getInputTextValue = this.getInputTextValue.bind(this);
        this.saveTrackerId = this.saveTrackerId.bind(this);
        this.saveTrackerMonHoursDivision = this.saveTrackerMonHoursDivision.bind(this);
        this.send = this.send.bind(this);
        this.initializeTrackerInfo = this.initializeTrackerInfo.bind(this);

        this.state["man-hours_division"] = this.initializeTrackerInfo(redmineConfig.redmineTrackerList, redmineConfig.trackerMonHoursDivisionList, "0");
        this.state["tracker_id"] = this.initializeTrackerInfo(redmineConfig.redmineTrackerList, redmineConfig.trackerActiveList, false);
    }

    initializeTrackerInfo(redmineTrackerList, trackerInfoList, defaultValue) {
        if (!Array.isArray(trackerInfoList)) {
            trackerInfoList = [];
        }

        if (trackerInfoList.length < redmineTrackerList.length) {
            for (let i = 0; i < redmineTrackerList.length; i++) {
                trackerInfoList[redmineTrackerList[i].id] = trackerInfoList[redmineTrackerList[i].id] ?? defaultValue;
            }
        } else if (trackerInfoList.length > redmineTrackerList.length) {
            let isExist = false;
            for (let i = 1; i <= trackerInfoList.length; i++) {
                isExist = false;
                for (let j = 0; j < redmineTrackerList.length; j++) {
                    if (redmineTrackerList[j].id === i) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    delete trackerInfoList[i];
                }
            }
        }
        return trackerInfoList;
    }

    //stateのcountの値を更新するコールバック関数
    getInputTextValue( name, value ){
        let state = {};
        state[name] = value;
        this.setState(state);
    }

    async send() {
        await window.electronAPI.saveRedmineConfig(this.state);
    }

    saveInfo(stateKey, namePrefix) {
        return function(event) {
            console.log(event.target);
            let state = this.state;
            let trackerId = event.target.name.replace(namePrefix, "");
            state[stateKey][trackerId] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
            this.setState(state);
            console.log(this.state);
        }.bind((this));
    }

    saveTrackerId(event) {
        this.saveInfo("tracker_id", "tracker_id_")(event);
    }

    saveTrackerMonHoursDivision(event) {
        this.saveInfo("man-hours_division", "division_")(event);
    }

    renderTrackerTable() {
        const rows = this.redmineTrackerList.map((redmineTracker,index) =>
            <tr key={redmineTracker.id}>
                <td>
                    <input type="checkbox" name={"tracker_id_" + redmineTracker.id} checked={this.state["tracker_id"][redmineTracker.id]} onChange={this.saveTrackerId} />
                </td>
                <td>
                    {redmineTracker.id}
                </td>
                <td>
                    {redmineTracker.name}
                </td>
                <td>
                    <select class="form-select" name={"division_" + redmineTracker.id} onChange={this.saveTrackerMonHoursDivision}>
                        <option value="0" selected={this.state["man-hours_division"][redmineTracker.id] === "0"}>開発</option>
                        <option value="1" selected={this.state["man-hours_division"][redmineTracker.id] === "1"}>テスト</option>
                    </select>
                </td>
            </tr>
        );

        return (
            <table class="table mgr-tbl">
                <thead>
                <tr>
                    <th>有効</th>
                    <th>ID</th>
                    <th>トラッカー名</th>
                    <th>利用区分</th>
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
                <TitleLabel label="Redmine設定" />
                <SectionLabel label="トラッカー設定" />
                {this.renderTrackerTable()}
                <button className="btn btn-outline-primary" onClick={() => this.send()}>登録</button>
                <Message message="設定しました。" id="fine"></Message>
            </div>
        );
    }
}