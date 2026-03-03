export interface FAQ {
    id: string;
    question: string;
    answer: string;
    keyword: string;
    created: string;
    updated: string;
}

export interface FAQListResponse {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: FAQ[];
}
