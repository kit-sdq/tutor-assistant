export interface Setting {
    id: string
    name: string
    content: string
    type: 'MAIN' | 'VALUES'
}

export interface Resource {
    id: string
    displayName: string
}


export interface TutorAssistantDocument {
    id: string
    title: string
    loaderType: string
    collection?: string
}

export interface FileDocument extends TutorAssistantDocument {
    fileStoreId: string
}

export interface WebsiteDocument extends TutorAssistantDocument {
    url: string
}