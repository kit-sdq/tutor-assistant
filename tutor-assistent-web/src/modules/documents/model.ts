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


export interface Document {
    id: string
    title: string
    loaderType: string
    collection: string
}

export interface FileDocument extends Document {
}

export interface WebsiteDocument extends Document {
    url: string
}