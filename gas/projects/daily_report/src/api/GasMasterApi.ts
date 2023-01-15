import {AbstractApi} from "./AbstractApi";

export class GasMasterApi extends AbstractApi {
    public static async getUserList() {
        const url = 'https://script.google.com/macros/s/AKfycbzYCgniwrim3LGUjm-AO_B7auCMG4YA04n3bUXeHzaNu_YsYx3QI5aESjqGEQYKtoYMZQ/exec';
        const query = {
            "target": "user",
            "user_id": "all"
        };
        let res = await this.callGetApi(url, {}, query);
        if (typeof res?.userList === "undefined") {
            throw new Error("ユーザ情報の取得に失敗しました。");
        }
        return res.userList;
    }
}