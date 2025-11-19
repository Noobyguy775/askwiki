export interface MediaWikiAPISearchResult {
    pages: Array<MediaWikiApiSearchPage> | [];
}

export interface MediaWikiApiSearchPage {
    id: number;
        key: string;
        title: string;
        excerpt: string;
        description: string;
        matched_title?: string;
        anchor?: string;
        thumbnail: {
            mimetype: string;
            width: number | null;
            height: number | null;
            duration: number | null;
            url: string;
        } | null;
}