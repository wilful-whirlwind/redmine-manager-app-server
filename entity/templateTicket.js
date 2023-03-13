/**
 * バージョン
 */
module.exports = class TemplateTicket {
    /**
     * constructor
     */
    constructor(id, label, startDate, endDate, content, useFlag, parent, trackerId, categoryId, ticketList) {
        this.id = id;
        this.label = label;
        this.startDate = startDate;
        this.endDate = endDate;
        this.content = content;
        this.useFlag = useFlag;
        this.parent = parent;
        this.trackerId = trackerId;
        this.categoryId = categoryId;
        this.children = TemplateTicket.getChildrenFromTicketList(id, ticketList);
    }

    static getChildrenFromTicketList(id, ticketList) {
        if (!Array.isArray(ticketList)) {
            throw new Error("不正なテンプレートチケットリストです。");
        }
        if (ticketList.length < 1) {
            return [];
        }
        if (typeof id !== "string" && typeof id !== "number") {
            throw new Error("不正なテンプレートチケットリストIDです。");
        }

        let childrenList = [];
        for (let i = 0; i < ticketList.length; i++) {
            if (parseInt(id) !== parseInt(ticketList[i].parent_issue_id)) {
                continue;
            }
            childrenList.push(ticketList[i].id);
        }
        return childrenList;
    }
}