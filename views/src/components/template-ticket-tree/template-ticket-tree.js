import React from 'react';
import './template-ticket-tree.css';
import {TreeView, TreeItem} from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MDEditor from '@uiw/react-md-editor';
import DatePicker from 'react-datepicker';
import './react-datepicker.css';

export class TemplateTicketTree extends React.Component {
    constructor(props) {
        super(props);
        this.renderTree = this.renderTree.bind(this);
        this.render = this.render.bind(this);
        this.setTicketDetail = this.setTicketDetail.bind(this);
        this.searchNode = this.searchNode.bind(this);
        this.setNodeValue = this.setNodeValue.bind(this);
        this.toggleStyle = this.toggleStyle.bind(this);
        this.changeUseFlag = this.changeUseFlag.bind(this);
        this.setDate = this.setDate.bind(this);
        this.tree = React.createRef();
        this.tree = this.props.tree;
        for (let i = 0; i < this.tree.length; i++) {
            this.tree[i].disabled = false;
            this.tree[i].startDate = this.tree[i].startDate ?? "";
            this.tree[i].endDate = this.tree[i].endDate ?? "";
        }
        this.activeStyle = {
            color: "#000"
        };
        this.inactiveStyle = {
            color: "#797979"
        };
        const defaultNode = this.searchNode(1);
        this.state = {
            id: defaultNode.id,
            label: defaultNode.label,
            startDate: defaultNode.startDate,
            endDate: defaultNode.endDate,
            content: defaultNode.content,
            useFlag: true,
            disabled: defaultNode.disabled,
            callback: this.props.callback
        };
        this.setState(this.state);
    }

    searchNode(id, nodeId) {
        if (typeof nodeId === "undefined") {
            nodeId = this.tree[0].id;
        }
        let node = null;
        for (let i = 0; i < this.tree.length; i++) {
            if (this.tree[i].id === nodeId) {
                node = this.tree[i];
            }
        }
        if (id === nodeId) {
            return node;
        }
        let search = null;
        for (let i = 0; i < node.children.length; i++) {
            search = this.searchNode(id, node.children[i]);
            if (search !== false) {
                return search;
            }
        }
        return false;
    }

    setTicketDetail(id) {
        const searchNode = this.searchNode;
        let resFunc = function() {
            const targetNode = searchNode(id);
            this.state.id = targetNode.id;
            this.state.content = targetNode.content;
            this.state.startDate = targetNode.startDate ?? "";
            this.state.endDate = targetNode.endDate ?? "";
            this.state.label = targetNode.label;
            this.state.useFlag = targetNode.useFlag;
            this.state.disabled = targetNode.disabled;
            this.setState(this.state);
        }
        resFunc = resFunc.bind(this);
        return resFunc;
    }

    changeUseFlag(id, flag, lockFlag) {
        let node = null;
        for (let i = 0; i < this.tree.length; i++) {
            if (this.tree[i].id === id) {
                node = this.tree[i];
                this.tree[i].useFlag = flag;
                this.tree[i].disabled = !flag && lockFlag;
                break;
            }
        }
        if (node === null) {
            return;
        }
        let children = node.children;
        for (let j = 0; j < children.length; j++) {
            this.changeUseFlag(children[j], flag, true);
        }
    }

    setNodeValue(key) {
        let node = this.searchNode(this.state.id);
        const changeUseFlag = this.changeUseFlag;
        let resFunc = function (e) {
            let state = {};
            let input = null;
            if (!e) {
                
            } else if (e.constructor.name === "Date") {
                 input = "" + e.getFullYear() + "-" + (e.getMonth()+1).toString().padStart(2, '0') + "-" + e.getDate().toString().padStart(2, '0');
            } else if (typeof e === "string") {
                input = e;
            } else {
                if (e.target.value === "on") {
                    input = e.target.checked;
                    changeUseFlag(node.id, !node.useFlag, false);
                } else {
                    input = e.target.value;
                }
            }
            state[key] = input;
            this.setState(state);
            for (let i = 0; i < this.tree.length; i++) {
                if (this.tree[i].id === this.state.id) {
                    this.tree[i][key] = input;
                    break;
                }
            }
            node[key] = input;
            this.state.callback(this.state.id, node);
        }
        resFunc = resFunc.bind(this);
        return resFunc;
    }

    toggleStyle(node) {
        if (node.useFlag) {
            return this.activeStyle;
        }
        return this.inactiveStyle;
    }
    setDate(dateStr) {
        if (dateStr === null || dateStr.length < 1) {
            return null;
        }
        let ymdArr = dateStr.split("-");
        const res = new Date(parseInt(ymdArr[0]), parseInt(ymdArr[1]) - 1, parseInt(ymdArr[2]));
        console.log(dateStr);
        console.log(res);
        return new Date(parseInt(ymdArr[0]), parseInt(ymdArr[1]) - 1, parseInt(ymdArr[2]));
    }

    renderTree(node) {
        const tree = <TreeItem style={this.toggleStyle(node)} nodeId={node.id} label={node.label} onClick={this.setTicketDetail(node.id)}></TreeItem>;
        tree.props.children = [];
        for (let i = 0; i < node.children.length; i++) {
            for (let j = 0; j < this.tree.length; j++) {
                if (this.tree[j].id === node.children[i]) {
                    tree.props.children.push(this.renderTree(this.props.tree[j]));
                }
            }
        }
        return tree;
    }

    render() {
        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div id={"screen"} className={"col-3"}>
                        <div className={"tree-container"}>
                            <TreeView
                                aria-label="template ticket tree"
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                            >
                                {this.renderTree(this.tree[0])}
                            </TreeView>
                        </div>
                    </div>
                    <div id={"ticket-info"} className={"col-9"}>
                        <div className={"container"}>
                            <div className={"row g-1"}>
                                <div className={"col-auto"}>
                                    <label>
                                        タイトル:
                                    </label>
                                </div>
                                <div className={"col-auto"}>
                                    <input
                                        type="text"
                                        id={"title"}
                                        value={this.state.label}
                                        class="form-control"
                                        onChange={this.setNodeValue("label")}
                                        maxLength={128}
                                    />
                                </div>
                                <div className={"col-auto"}>
                                    <input
                                        type="checkbox"
                                        id={"useFlag"}
                                        checked={this.state.useFlag}
                                        className="form-check-input"
                                        disabled={this.state.disabled}
                                        onChange={this.setNodeValue("useFlag")}
                                    />
                                    <label className={"form-check-label"} htmlFor={"useFlag"}>
                                        作成する
                                    </label>
                                </div>
                            </div>
                            <div className={"row g-1"}>
                                <div className={"col-auto"}>
                                    <label>
                                        作業期間:
                                    </label>
                                </div>
                                <div className={"col-auto"}>
                                    <DatePicker
                                        selected={this.setDate(this.state.startDate)}
                                        dateFormat="yyyy-MM-dd"
                                        onChange={this.setNodeValue("startDate")}
                                    />
                                </div>
                                <div className={"col-auto"}>
                                    <span className="form-control-plaintext">～</span>
                                </div>
                                <div className={"col-auto"}>
                                    <DatePicker
                                        selected={this.setDate(this.state.endDate)}
                                        dateFormat="yyyy-MM-dd"
                                        onChange={this.setNodeValue("endDate")}
                                    />
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <MDEditor
                                        value={this.state.content}
                                        onChange={this.setNodeValue("content")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}