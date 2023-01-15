import {GasMasterApi} from "../api/GasMasterApi";

export class UserLogic {
    async getUserList()
    {
        await GasMasterApi.getUserList();
    }
}