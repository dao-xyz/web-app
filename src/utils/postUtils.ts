import {
  ContentSourceExternal,
  ContentSourceString,
} from "@dao-xyz/sdk-common";
import {
  LinkPostContent,
  PostAccount,
  StringPostContent,
} from "@dao-xyz/sdk-social";
import { isValidHttpUrl } from "./urlUtils";



export const getPostContentString = async (
  post: PostAccount
): Promise<string | undefined> => {
  if (post.content instanceof StringPostContent) {
    return Promise.resolve(post.content.string);
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
};
