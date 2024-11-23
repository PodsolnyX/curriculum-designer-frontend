
export type TestsOrder = {
    order_number: number,
    tests: TestDto[]
}

export const TestOrderName: Record<number, string> = {
    1: "Тесты над одной вершиной",
    2: "Тесты между вершинами одного домена",
    3: "Кросс-доменное тестирование"
}

export type TestDto = {
    test_id: string;
    name?: string,
    description?: string,
    run_num: number,
    default_parameters: Dictionary<number>,
    graphs_tests: TestGraphDto[]
}

export type TestGraphDto = {
    graph_id: string,
    number_graph: number,
    nodes: {
        name: string
    }[],
    result_previous_completed: boolean,
    result_previous_tests: string[],
    attributes: string[][]
}

export type TestsGroupDetailsDto = {
    order_number: number,
    order_description: string,
    tests: TestsGroupDetailsTestDto[]
}

export type TestsGroupDetailsTestDto = {
    test_id: string;
    name?: string,
    description?: string,
    run_num: number,
    default_parameters: Dictionary<number>
}

export type TestDetailsDto = {
    test_id: string,
    name: string,
    description: string,
    order_number: number,
    run_num: number,
    default_parameters: Dictionary<number>,
    graphs_tests: TestGraphDto[]
}

export type GraphDetailsDto = {
    order_of_test: number,
    test_id: string,
    test_name: string,
    test_description: string,
    graph_id: number,
    graph_number: number,
    attributes: string[][],
    tests: GraphTests[]
}

export type GraphTests = {
    parameters: Dictionary<number>,
    nodes: { name: string }[]
}

export type RunTestDto = {
    test_id?: string,
    graph_number?: number,
    node_ids?: string[],
    parameters?: Dictionary<number>
}

