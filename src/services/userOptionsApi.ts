import DEFAULT_USER from "../mock/userOptions.json";
import { UserInfo } from "../store/userStore";
import { delay } from "./localConfig";

class UserInfoApi {
    async fetchUserInfo(): Promise<UserInfo> {
        await delay(200); // Simulate API delay
        return DEFAULT_USER as UserInfo;
    }
}

export const userOptionsApi = new UserInfoApi();
