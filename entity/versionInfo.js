/**
 * バージョン
 */
module.exports = class VersionInfo {
    /**
     * constructor
     * @param major
     * @param minor
     * @param maintenance
     * @param dueDate
     */
    constructor(major, minor, maintenance, dueDate) {
        this.major = major;
        this.minor = minor;
        this.maintenance = maintenance;
        this.dueDate = dueDate;
    }

    /**
     * version名を生成
     * @param prefix
     * @param separator
     * @param suffix
     * @return string 生成されたバージョン名
     */
    getVersionName(prefix = "ver.", separator = ".", suffix = "_POSサーバー") {
        const joinedVersion = [this.major, this.minor, this.maintenance].join(separator);
        return prefix + joinedVersion + suffix;
    }
}