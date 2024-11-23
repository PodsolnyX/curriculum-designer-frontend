export type EditProjectNameDto = {
    new_project_name?: string
}

export type ProjectDto = {
    project_id: string,
    project_name: string,
    project_owner: MemberDto,
    project_members: MemberDto[],
    has_nodes: boolean
}

export type MemberDto = {
    id: string,
    name: string
}

export type CreateProjectDto = {
    project_name: string
}

export type UserProjectsDto = {
    owned_projects: ProjectDto[],
    member_projects: ProjectDto[]
}