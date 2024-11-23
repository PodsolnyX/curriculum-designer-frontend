import {instance} from "@/shared/lib/api/api.ts";
import {
    CreateProjectDto,
    EditProjectNameDto,
    ProjectDto,
    UserProjectsDto
} from "./projectModels.ts";

class ProjectService {

    async getProjects() {
        return instance.get<UserProjectsDto>(`/project/get/`)
    }

    async getProject(projectId: string) {
        return instance.get<ProjectDto>(`/project/${projectId}/get/`)
    }

    async createProject(data: CreateProjectDto) {
        return instance.post(`/project/create_project/`, data)
    }

    async deleteProject(projectId: string) {
        return instance.delete(`/project/${projectId}/delete/`)
    }

    async addProjectMember(projectId: string, userId: string) {
        return instance.post(`/project/${projectId}/member/add/`, {}, {
            params: {user_data: userId}
        })
    }

    async removeProjectMember(projectId: string, userId: string) {
        return instance.delete(`/project/${projectId}/member/remove/`, {
            params: {user_data: userId}
        })
    }

    async editProjectName(id: string, data: EditProjectNameDto) {
        return instance.put(`/project/${id}/edit/`, data)
    }

}

export const projectService = new ProjectService();