/**
 * https://www.mediawiki.org/wiki/API:REST_API/Reference#Schema
 */
export interface MediaWikiApiSearch extends MediaWikiApiPageShared {
    // A few lines giving a sample of page content with search terms highlighted with <span class=\"searchmatch\"> tags 
    excerpt: string;
    // In Wikimedia projects: Short summary of the page topic based on the corresponding entry on Wikidata or null if no entry exists
    description: string;
    // The title of the page redirected from, if the search term originally matched a redirect page or null if search term did not match a redirect page.
    matched_title?: string;
    // Information about the thumbnail image for the page
    thumbnail?: {
        // Thumbnail media type
        mimetype: string;
        // Maximum recommended image width in pixels
        width: number | null;
        // Maximum recommended image height in pixels
        height: number | null;
        // Length of the video, audio, or multimedia file or null for other media types
        duration: number | null;
        // URL to download the file
        url: string;
    };
}
/**
 * https://www.mediawiki.org/wiki/API:REST_API/Reference#Schema_2
 */
export interface MediaWikiApiPage extends MediaWikiApiPageShared {
    // Information about the latest revision
    latest: {
        // Revision identifier for the latest revision
        id: number;
        // Timestamp of the latest revision in ISO 8601 format
        timestamp: string;
    };
    // Type of content on the page
    content_model: string;
    // Information about the wiki's license, including: 
    license: {
        // URL of the applicable license based on the $wgRightsUrl setting
        url: string;
        // Name of the applicable license based on the $wgRightsText setting
        title: string;
    };
    // API route to fetch the content of the page in HTML 
    html_url?: string;
    // Latest page content in HTML
    html?: string;
    // Latest page content in the format specified by the content_model property
    source?: string;
}

/**
 * Undocumented, but these are always null
 */
export interface FandomApiSearch extends MediaWikiApiSearch {
    thumbnail: null;
    excerpt: null;
    matched_title: null;
}

interface MediaWikiApiPageShared {
    // Page identifier 
    id: number;
    // Page title in URL-friendly format 
    key: string;
    // Page title in reading-friendly format 
    title: string
}