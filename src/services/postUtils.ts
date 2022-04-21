import { ContentSourceExternal, ContentSourceString } from "@dao-xyz/sdk-common";
import { LinkPostContent, PostAccount, StringPostContent } from "@dao-xyz/sdk-social";

const isValidHttpUrl = (string) => {
    let url = undefined;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export const getContentString = async (post: PostAccount): Promise<string | undefined> => {
    if (post.content instanceof StringPostContent) {
        return Promise.resolve(post.content.string)
    }
    let url = (post.content as LinkPostContent).url;
    if (url && isValidHttpUrl(url)) {
        const result = await fetch(url, {}).catch(() => undefined);
        if (result) {
            if (result.status >= 200 && result.status < 300) {
                let text = await result.text().catch(() => undefined);
                return text;
            }

        }
        return undefined;
    }
}