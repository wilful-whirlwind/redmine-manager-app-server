/**
 * ユーザ
 */
module.exports = class User {

    /**
     * @param id
     * @param name
     * @param redmineUserId
     * @param timecardUserId
     * @param mailAddress
     * @param passwordHash
     */
    constructor(id, name, redmineUserId, timecardUserId, mailAddress, passwordHash) {
        this.id = id;
        this.name = name;
        this.redmineUserId = redmineUserId;
        this.timecardUserId = timecardUserId;
        this.mailAddress = mailAddress;
        this.passwordHash = passwordHash;
    }
}