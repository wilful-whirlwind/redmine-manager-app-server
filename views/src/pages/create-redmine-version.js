import React, {useRef} from "react";
import {TitleLabel} from "../components/title-label/title-label";
import {SectionLabel} from "../components/section-label/section-label";
import {InputText} from "../components/input-text/input-text";
import {Message} from "../components/message/message";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export class CreateRedmineVersion extends React.Component {
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
            releaseDate: "",
            eventDateTimeList: [],
            versionIsChecked: false
        }
        this.setInputValue = this.setInputValue.bind(this);
        this.setVersionNumber = this.setVersionNumber.bind(this);
        this.saveInfo = this.saveInfo.bind(this);
        this.saveEventId = this.saveEventId.bind(this);
        this.send = this.send.bind(this);
        this.renderEventTable = this.renderEventTable.bind(this);
        this.renderEventDateRangeForm = this.renderEventDateRangeForm.bind(this);
        this.setEventDateTime = this.setEventDateTime.bind(this);
        this.getCurrentEventListFromCalender = this.getCurrentEventListFromCalender.bind(this);
        this.eventList = React.createRef();
        const eventListInfo = window.electronAPI.getEventList(this.state);
        this.dateTimeList = [];
        if (eventListInfo.status === "success") {
            this.state["event_id"] = [];
            this.eventList = eventListInfo.eventList;
            for (let i = 0; i < this.eventList.length; i++) {
                this.state["event_id"][this.eventList[i].id] = this.eventList[i].use_flag;
            }
        } else {
            this.state["event_id"] = [];
        }
    }

    setInputValue(name, value) {
        let state = {};
        state[name] = value;
        this.setState(state);
    }

    setVersionNumber(name, value) {
        this.setInputValue(name, value);
        this.setInputValue("versionIsChecked", false);
    }

    async send() {
        let state = this.state;
        this.setState(state);
        await window.electronAPI.initializeVersion(this.state);
        
    }

    /**
     * MTGの日および開始時刻の設定
     * @param e
     */
    setEventDateAndFrom(e) {
        console.log(e.format());
    }

    setEventTo(e) {
        console.log(e.format());
    }

    saveInfo(stateKey, namePrefix) {
        return function(event) {
            let state = this.state;
            let trackerId = event.target.name.replace(namePrefix, "");
            state[stateKey][trackerId] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
            this.setState(state);
        }.bind((this));
    }

    saveEventId(event) {
        this.saveInfo("event_id", "event_id_")(event);
    }

    setEventDateTime(dateTimeDivision, eventId, eventName) {
        let targetEvent = {};
        let eventDateTimeListIndex = -1;
        for (let i = 0; i < this.state.eventDateTimeList.length; i++) {
            if (this.state.eventDateTimeList[i].id === eventId) {
                targetEvent = this.state.eventDateTimeList[i];
                eventDateTimeListIndex = i;
            }
        }
        let state = this.state;
        let resFunc = function(e) {
            let inputTime = "";
            let inputDate = "";
            if (e.constructor.name === "Date") {
                let zeroFillMonth = "";
                let zeroFillDay = "";
                let zeroFillHours = "";
                let zeroFillMinutes = "";
                let zeroFillSeconds = "";
                if (e.getUTCMonth() < 9) {
                    zeroFillMonth = "0";
                }
                if (e.getUTCDay() < 10) {
                    zeroFillDay = "0";
                }
                if (e.getUTCHours() < 10) {
                    zeroFillHours = "0";
                }
                if (e.getUTCMinutes() < 10) {
                    zeroFillMinutes = "0";
                }
                if (e.getUTCSeconds() < 10) {
                    zeroFillSeconds = "0";
                }
                inputTime = zeroFillHours + e.getUTCHours() + ":" + zeroFillMinutes + e.getUTCMinutes() + ":" + zeroFillSeconds + e.getUTCSeconds();
                inputDate = e.getUTCFullYear() + "-" + zeroFillMonth + (e.getUTCMonth() + 1) + "-" + zeroFillDay + e.getUTCDate();
            } else {
                inputTime = e.format('HH:mm:ss');
                inputDate = e.format('YYYY-MM-DD');
            }
            console.log(inputDate);
            console.log(inputTime);
            console.log(targetEvent);
            console.log(eventId);
            targetEvent.id = eventId;
            targetEvent.name = eventName;
            if (dateTimeDivision === 'from') {
                this.dateTimeList["event-from-" + eventId] = inputTime;
                targetEvent.from = inputTime;
            } else if (dateTimeDivision === 'to') {
                this.dateTimeList["event-to-" + eventId] = inputTime;
                targetEvent.to = inputTime;
            } else if (dateTimeDivision === 'ymd') {
                this.dateTimeList["event-ymd-" + eventId] = inputDate;
                targetEvent.ymd = inputDate;
            }
            if (eventDateTimeListIndex === -1) {
                state.eventDateTimeList.push(targetEvent);
            } else {
                state.eventDateTimeList[eventDateTimeListIndex] = targetEvent;
            }
            this.setState((state) => {
                return {eventDateTimeList: state.eventDateTimeList}
            });
        }

        resFunc = resFunc.bind(this);
        return resFunc;
    }

    async getCurrentEventListFromCalender() {
        const versionInfo = await window.electronAPI.getCurrentEventListFromCalender(this.state);
        if (
            versionInfo?.status !== "success" ||
            !Array.isArray(versionInfo?.eventList)
        ) {
            alert("google calendar情報の取得に失敗しました。");
        }
        console.log(versionInfo);
        let e = {};
        this.dateTimeList = [];
        this.setState((state) => {
            return {eventDateTimeList: []}
        });
        for (let i = 0; i < versionInfo.eventList.length; i++) {
            for (let j = 0; j < this.eventList.length; j++) {
                if (versionInfo.eventList[i].title === this.eventList[j].name) {
                    e = new Date(versionInfo.eventList[i].start);
                    this.setEventDateTime('ymd', this.eventList[j].id, this.eventList[j].name)(e);
                    if (versionInfo.eventList[i].all_day_event_flag) {
                        break;
                    }
                    this.setEventDateTime('from', this.eventList[j].id, this.eventList[j].name)(e);
                    e = new Date(versionInfo.eventList[i].end);
                    this.setEventDateTime('to', this.eventList[j].id, this.eventList[j].name)(e);
                }
            }
        }
        this.setInputValue("versionIsChecked", true);
    }

    renderEventDateRangeForm(event) {
        if (event.all_day_flag) {
            return "終日";
        } else {
            return (
                <>
                    <Datetime
                        id={"event-from-" + event.id}
                        value={this.dateTimeList["event-from-" + event.id]}
                        locale={"ja"}
                        dateFormat={false}
                        timeFormat="HH:mm:ss"
                        onChange={this.setEventDateTime('from', event.id, event.name)}
                    />
                    〜
                    <Datetime
                        className={"event-to-" + event.id}
                        value={this.dateTimeList["event-to-" + event.id]}
                        locale={"ja"}
                        dateFormat={false}
                        timeFormat="HH:mm:ss"
                        onChange={this.setEventDateTime('to', event.id, event.name)}
                    />
                </>
            )
        }
    }

    renderEventTable() {
        const rows = this.eventList.map((event,index) =>
            <tr key={event.id}>
                <td>
                    <input type="checkbox" name={"event_id_" + event.id} checked={this.state["event_id"][event.id]} onChange={this.saveEventId} />
                </td>
                <td>
                    {event.id}
                </td>
                <td>
                    {event.name}
                </td>
                <td>
                    <Datetime
                        className={"event-ymd-" + event.id}
                        value={this.dateTimeList["event-ymd-" + event.id]}
                        locale={"ja"}
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={this.setEventDateTime('ymd', event.id, event.name)}
                    />
                </td>
                <td>
                    {this.renderEventDateRangeForm(event)}
                </td>
            </tr>
        );

        return (
            <table class="table mgr-tbl">
                <thead>
                <tr>
                    <th>有効</th>
                    <th>ID</th>
                    <th>ミーティング名</th>
                    <th>開始日時</th>
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
                            <InputText id="majorVersion" callback={this.setVersionNumber} />
                        </td>
                        <td>
                            <InputText id="minorVersion" callback={this.setVersionNumber} />
                        </td>
                        <td>
                            <InputText id="maintenanceVersion" callback={this.setVersionNumber} />
                        </td>
                    </tr>
                    <tr>
                        <td><button type="button" class="btn btn-outline-secondary" onClick={this.getCurrentEventListFromCalender}>イベント情報の取得</button></td>
                        <td></td>
                        <td></td>
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
                            <InputText id="developmentPeriodFrom" callback={this.setInputValue} />
                        </td>
                        <td>
                            ~
                        </td>
                        <td>
                            <InputText id="developmentPeriodTo" callback={this.setInputValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            QA期間
                        </th>
                        <td>
                            <InputText id="qaPeriodFrom" callback={this.setInputValue} />
                        </td>
                        <td>
                            ~
                        </td>
                        <td>
                            <InputText id="qaPeriodTo" callback={this.setInputValue} />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            リリース日
                        </th>
                        <td>
                            <InputText id="releaseDate" callback={this.setInputValue} />
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <SectionLabel label="Meeting" />
                {this.renderEventTable()}
                <button class="btn btn-outline-primary" disabled={!this.state.versionIsChecked} onClick={() => this.send()}>バージョン生成</button>
                <Message message="登録しました。" id="fine"></Message>
            </div>
        );
    }
}