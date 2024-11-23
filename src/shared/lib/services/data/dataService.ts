import {instance} from "@/shared/lib/api/api.ts";
import {
    CategoryDto,
    DomainDataDto,
    NodeDataDto,
    PrimaryData,
    TypeNodeDataDto,
    UploadFileDto,
    ProjectFileDto,
    AvailableDataNodesDto,
    AvailableDataPrimaryDto, ConverterResponseDto, DomainCategoriesDto
} from "./dataModels.ts";
import {AxiosProgressEvent} from "axios";

class DataService {

    async getProjectFiles(projectId: string) {
        return instance.get<{ files: ProjectFileDto[] }>(`/project/${projectId}/file/get/all/`)
    }

    async uploadFile(data: UploadFileDto, onProgressCallback?: (progressEvent: AxiosProgressEvent) => void) {

        const formData = new FormData();
        data.files.forEach(file => formData.append("files", file))

        return instance.post<ConverterResponseDto>(`/project/${data.projectID}/file/upload/`, formData, {
            params: {category: data.category},
            onUploadProgress: (progressEvent) => onProgressCallback &&
                onProgressCallback(progressEvent)

        })
    }

    async getDomainsCategories(projectId: string) {
        return instance.get<{domain_categories: DomainCategoriesDto[]}>(`/project/${projectId}/domain-categories/`)
    }

    async getProjectCategories(projectId: string) {
        return instance.get<{ categories: CategoryDto[] }>(`/project/${projectId}/categories/get/`)
    }

    async getAvailableDataNodes(projectId: string) {
        return instance.get<AvailableDataNodesDto>(`/project/${projectId}/available_data_nodes/get/`)
    }

    async getDomainData(projectId: string, domain: string) {
        return instance.get<DomainDataDto>(`/project/${projectId}/node_types_sharded/get`, {
            params: {domain_name: domain}
        })
    }

    async getTypeNodeData(projectId: string, typeNodeId: string) {
        return instance.get<TypeNodeDataDto>(`/project/${projectId}/nodes_sharded/get`, {
            params: {type_id: typeNodeId}
        })
    }

    async getNodeData(projectId: string, nodeId: string) {
        return instance.get<NodeDataDto>(`/project/${projectId}/node_sharded/get`, {
            params: {node_id: nodeId}
        })
    }

    async getAvailableDataPrimary(projectId: string) {
        return instance.get<AvailableDataPrimaryDto>(`/project/${projectId}/available_data_primary/get/`)
    }

    async getPrimary(projectId: string, typeData: string) {
        return instance.get<PrimaryData[]>(`/project/${projectId}/primary/get/`, {
            params: {type_data: typeData}
        })
    }
}

export const dataService = new DataService();