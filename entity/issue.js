/**
 * バージョン
 * @type {Issue}
 */
module.exports = class Issue {

    static TRACKER_ID_FEATURE = 2;
    static TRACKER_ID_ENHANCEMENT = 3;
    static TRACKER_ID_BUG = 1;

    /**
     * constructor
     * @param obj
     */
    constructor(obj) {
        this.id = obj.id;
        this.trackerId = obj.tracker.id;
        this.fixedVersionId = obj.fixed_version;
        this.estimatedHours = obj.estimated_hours;
    }
}