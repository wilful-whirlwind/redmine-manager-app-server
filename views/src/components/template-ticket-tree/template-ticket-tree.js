import React from 'react';
import './template-ticket-tree.css';
import {TreeView, TreeItem} from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {InputText} from "../input-text/input-text";
import MDEditor from '@uiw/react-md-editor';
import {InputDateTime} from "../input-date-time/input-date-time";
import Datetime from 'react-datetime';

export class TemplateTicketTree extends React.Component {
    constructor(props) {
        super(props);
        this.renderTree = this.renderTree.bind(this);
        this.render = this.render.bind(this);
        this.setTicketDetail = this.setTicketDetail.bind(this);
        this.searchNode = this.searchNode.bind(this);
        this.setLabel = this.setLabel.bind(this);
        this.state = {
            id: "",
            label: "",
            startDate: "",
            endDate: "",
            content: ""
        };
    }

    searchNode(id, node) {
        if (typeof node === "undefined") {
            node = this.props.tree;
        }
        if (node.id === id) {
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

    setTicketDetail(node) {
        const searchNode = this.searchNode;
        let resFunc = function() {
            const targetNode = searchNode(node.id);
            console.log(targetNode);
            this.state.id = targetNode.id;
            this.state.content = targetNode.content;
            this.state.startDate = targetNode.startDate;
            this.state.endDate = targetNode.endDate;
            this.state.label = targetNode.label;
            this.setState(this.state);
        }
        resFunc = resFunc.bind(this);
        return resFunc;
    }

    setLabel(e) {
        this.setState({
            label: e.target.value
        })
    }

    renderTree(node) {
        const tree = <TreeItem nodeId={node.id} label={node.label} onClick={this.setTicketDetail(node)}></TreeItem>;
        tree.props.children = [];
        for (let i = 0; i < node.children.length; i++) {
            tree.props.children.push(this.renderTree(node.children[i]));
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
                                aria-label="file system navigator"
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                            >
                                {this.renderTree(this.props.tree)}
                            </TreeView>
                        </div>
                    </div>
                    <div id={"ticket-info"} className={"col-9"}>
                        <div className={"container"}>
                            <div className={"row"}>
                                <div className={"col-2"}>
                                    <label>
                                        タイトル:
                                    </label>
                                </div>
                                <div className={"col-10"}>
                                    <input
                                        type="text"
                                        id={"title"}
                                        value={this.state.label}
                                        class="form-control"
                                        onChange={this.setLabel}
                                    />
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-3"}>
                                    <label>
                                        作業期間:
                                    </label>
                                </div>
                                <div className={"col-9 form-inline"}>
                                    <Datetime
                                        id={"startDate"}
                                        value={this.state.startDate}
                                        locale={"ja"}
                                        dateFormat="YYYY-MM-DD"
                                        timeFormat={false}
                                    /> 〜
                                    <Datetime
                                        id={"endDate"}
                                        value={this.state.endDate}
                                        locale={"ja"}
                                        dateFormat="YYYY-MM-DD"
                                        timeFormat={false}
                                    />
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <MDEditor
                                        value={this.state.content}
                                        onChange={(e) => this.setState({content: e})}
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