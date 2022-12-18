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
            eventDateTimeList: []
        }
        this.getInputTextValue = this.getInputTextValue.bind(this);
        this.saveInfo = this.saveInfo.bind(this);
        this.saveEventId = this.saveEventId.bind(this);
        this.send = this.send.bind(this);
        this.renderEventTable = this.renderEventTable.bind(this);
        this.renderEventDateRangeForm = this.renderEventDateRangeForm.bind(this);
        this.setEventDateTime = this.setEventDateTime.bind(this);
        this.eventList = React.createRef();
        const eventListInfo = window.electronAPI.getEventList(this.state);
        console.log(eventListInfo);
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

    //stateのcountの値を更新するコールバック関数
    getInputTextValue( name, value ) {
        let state = {};
        state[name] = value;
        this.setState(state) ;
    }
    async send() {
        let state = this.state;
        this.setState(state);
        console.log(this.state);
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
            console.log(event.target);
            let state = this.state;
            let trackerId = event.target.name.replace(namePrefix, "");
            state[stateKey][trackerId] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
            this.setState(state);
            console.log(this.state);
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
        console.log(state);
        let resFunc = function(e) {
            const inputTime = e.format('HH:mm:ss');
            const inputDate = e.format('YYYY-MM-DD');
            console.log(inputDate);
            console.log(inputTime);
            console.log(targetEvent);
            console.log(eventId);
            targetEvent.id = eventId;
            targetEvent.name = eventName;
            if (dateTimeDivision === 'from') {
                targetEvent.from = inputTime;
            } else if (dateTimeDivision === 'to') {
                targetEvent.to = inputTime;
            } else if (dateTimeDivision === 'ymd') {
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

    renderEventDateRangeForm(event) {
        console.log(event);
        if (event.all_day_flag) {
            return "終日";
        } else {
            return (
                <>
                    <Datetime
                        locale={"ja"}
                        dateFormat={false}
                        timeFormat="HH:mm:ss"
                        onChange={this.setEventDateTime('from', event.id, event.name)}
                    />
                    〜
                    <Datetime
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
                <SectionLabel label="Meeting" />
                {this.renderEventTable()}
                <button class="btn btn-outline-primary" onClick={() => this.send()}>バージョン生成</button>
                <Message message="登録しました。" id="fine"></Message>
            </div>
        );
    }
}