import {instance} from "@/shared/lib/api/api.ts";
import {GraphDetailsDto, RunTestDto, TestDetailsDto, TestsGroupDetailsDto, TestsOrder} from "./testsModels.ts";


class TestsService {

    async getProjectTests(projectId: string) {
        return instance.get<{orders: TestsOrder[]}>(`/project/${projectId}/tests/enable/get/`)
    }

    async getGroup(projectId: string, groupId: string) {
        return instance.get<TestsGroupDetailsDto>(`/project/${projectId}/order/description/`, {
            params: {
                order_number : groupId
            }
        })
    }

    async getTest(projectId: string, testId: string) {
        return instance.get<TestDetailsDto>(`/project/${projectId}/test/detailed`, {
            params: {
                test_id: testId
            }
        })
    }

    async getGraph(projectId: string, graphId: string) {
        return instance.get<GraphDetailsDto>(`/project/${projectId}/graph/detailed`, {
            params: {
                graph_id: graphId
            }
        })
    }

    async runTests(projectId: string, tests: RunTestDto[]) {
        return instance.post(`/project/${projectId}/test/run/`, {tests})
    }

}

export const testService = new TestsService();