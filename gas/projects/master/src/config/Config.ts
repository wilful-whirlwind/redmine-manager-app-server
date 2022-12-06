/**
 * プロパティの設定はroot直下のConfig.tsを利用すること。
 */

export function getSpreadSheetId() {
    return PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_ID");
}