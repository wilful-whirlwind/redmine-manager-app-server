/**
 * ユーザ
 */
module.exports = class User {

    /**
     *
     * @param id
     * @param name
     * @param redmineUserId
     * @param timecardUserId
     * @param mailAddress
     */
    constructor(id, name, redmineUserId, timecardUserId, mailAddress) {
        this.id = id;
        this.name = name;
        this.redmineUserId = redmineUserId;
        this.timecardUserId = timecardUserId;
        this.mailAddress = mailAddress;
    }
}