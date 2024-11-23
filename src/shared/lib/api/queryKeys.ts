import {GetUsersParams} from "@/shared/lib/services/user/userModels.ts";

export const queryKeys = {
    userProfile: () => ["USER_PROFILE"],
    users: (params?: GetUsersParams) => ["USERS", params],
    refreshToken: () => ["REFRESH_TOKEN"],

    projects: () => ["PROJECTS"],
    project: (projectId?: string) => ["PROJECT", projectId],

    projectFiles: (projectId?: string) => ["PROJECT_FILES", projectId],
    domainsCategories: (projectId?: string) => ["DOMAINS_CATEGORIES", projectId],
    projectCategories: (projectId?: string) => ["PROJECT_CATEGORIES", projectId],

    availableDataNodes: (projectId?: string) => ["AVAILABLE_DATA_NODES", projectId],
    nodeData: (projectId?: string, typeNode?: string, nodeId?: string) => ["NODE_DATA", projectId, typeNode, nodeId],
    domainData: (projectId?: string, domain?: string) => ["DOMAIN_DATA", projectId, domain],
    typeNodeData: (projectId?: string, typeNode?: string) => ["TYPE_MODE_DATA", projectId, typeNode],

    availableDataPrimary: (projectId?: string) => ["AVAILABLE_DATA_PRIMARY", projectId],
    projectPrimary: (projectId?: string, typeData?: string) => ["PROJECT_PRIMARY", projectId, typeData],

    projectTests: (projectId?: string) => ["PROJECT_TESTS", projectId],
    group: (projectId?: string, groupId?: string) => ["GROUP", projectId, groupId],
    test: (projectId?: string, testId?: string) => ["TESTS", projectId, testId],
    graph: (projectId?: string, graphId?: string) => ["GRAPH", projectId, graphId]

}