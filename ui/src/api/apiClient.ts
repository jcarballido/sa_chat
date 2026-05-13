import { getAccessToken } from "../stores/authAdapter.store";
import { createApiClient } from "./createApiClient";

export const api = createApiClient({
    baseURL:'api',
    getAccessToken
})