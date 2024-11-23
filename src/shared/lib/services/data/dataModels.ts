
//DTO раздела файлов

export type ProjectFileDto = {
    file_id: string,
    filename: string,
    category: string
}

export type UploadFileDto = {
    projectID: string,
    files: File[],
    category: string
}

export type UploadFileErrorDto = {
    detail: string
}

export const CodeErrorsFileUpload: Record<string, string> = {
    "0": "Неизвестная ошибка",
    "1": "Файл(ы) с таким названием уже загружены в систему",
    "2": "Загрузите первичные данные для данной категории",
    "3": "Неподдерживаемый формат файла для данной категории"
}

export type CategoryDto = {
    name: string,
    description: string,
    extensions_files: string[][]
}

export type ConverterResponseTypeNodeDto = {
    type_node_id: string,
    agg_name: string,
    wells: string[]
}

export type ConverterResponseDto = {
    nodes: ConverterResponseTypeNodeDto[],
    primary_data: PrimaryData[],
    uploaded_files: {
        id: string,
        filename: string
    }[],
    errors?: Dictionary<any>,
    message: string
}

export type DomainCategoriesDto = {
    domain_name: string,
    categories: string[]
}

//DTO дерева узлов

export type AvailableDataNodesDto = {
    domains_list: TreeNodesDomainDto[]
}

export type TreeNodesDomainDto = {
    type_nodes_list: TreeNodesTypeNodeDto[],
    domain_name: string
}

export type TreeNodesTypeNodeDto = {
    type_node_id: string,
    type_node_name: string,
    node_list: TreeNodesNodeDto[]
}

export type TreeNodesNodeDto = {
    node_id: string,
    node_name: string
}

//DTO раздела узлов

export type DomainDataDto = {
    name: string,
    type_nodes_list: {
        id: string,
        type_name: string
    }[]
}

export type TypeNodeDataDto = {
    type_node_id: string,
    type_node_name: string,
    node_list: {
        node_id: string,
        node_name: string
    }[]
}

export type NodeDataDto = {
    id: string,
    name: string,
    type_node: string,
    node_data: Array<number | undefined>,
    values_attributes: Dictionary<string | string[]>
}

//DTO дерева первичных данных

export type AvailableDataPrimaryDto = {
    primary: TreePrimaryDomainDto[]
}

export type TreePrimaryDomainDto = {
    domain_name: string,
    type_data: string[]
}

//DTO раздела первичных данных

export type PrimaryData = {
    // _id: string,
    type_data: string,
    values: Dictionary<string | string[] | {}>,
    values_attributes: {}
}