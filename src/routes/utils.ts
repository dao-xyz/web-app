import { Location } from "history";

export const REDIRECT_URL_PARAM_KEY = "redir"

export const getRedirect = (location: Location): string | null => {
    const urlSearchParams = new URLSearchParams(location.search);
    return urlSearchParams.get(REDIRECT_URL_PARAM_KEY)
}