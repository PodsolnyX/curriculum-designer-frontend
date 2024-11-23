import {instance} from "@/shared/lib/api/api.ts";
import {
    GetUsersParams,
    LoginCredentials,
    RegisterCredentials,
    TokensResponse,
    UserDto,
    UserListDto
} from "./userModels.ts";

class UserService {

    async getProfile() {
        return instance.get<UserDto>(`/user/me/`)
    }

    async getUsers(params?: GetUsersParams) {
        return instance.get<UserListDto>(`/user/get/all`, {params})
    }

    async login(data: LoginCredentials) {
        return instance.post<TokensResponse>(`/user/login/`, data)
    }

    async register(data: RegisterCredentials) {
        return instance.post<TokensResponse>(`/user/register/`, data)
    }

    async refreshToken(refreshToken: string | null) {
        return instance.post<TokensResponse>(`/user/token_refresh/`, {refresh_token: refreshToken})
    }

}

export const userService = new UserService();