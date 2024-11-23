
export type UserDto = {
    id: string,
    name: string,
    email: string
}

export type GetUsersParams = {
    skip?: number,
    limit?: number,
    name?: string,
    email?: string
}

export type UserListDto = {
    users: UserDto[],
    total: number,
    skip: number,
    limit: number
}

export type LoginCredentials = {
    email: string,
    password: string
}

export type RegisterCredentials = {
    name: string,
    email: string,
    password: string
}

export type TokensResponse = {
    auth_token: string,
    refresh_token: string
}