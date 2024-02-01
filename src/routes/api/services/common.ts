import { SessionManager } from "../session.manager";
import { API_CLIENT_INTERNAL_KEY, BACKEND_API_URL } from "$env/static/private";
import { error } from "@sveltejs/kit";

export const delete_ = async (sessionId: string, url: string) => {
    console.log('Session Is at common ', sessionId);
    const session = await SessionManager.getSession(sessionId);
    console.log('Session', session);
    const accessToken = session ? session.accessToken : null;
    console.log(`accessToken = ${accessToken}`);
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    headers['Authorization'] = `Bearer ${accessToken}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers
    });
    const response = await res.json();
    console.log(response.Message);
    if (response.Status === 'failure' || response.HttpCode !== 200) {
        throw error(response.HttpCode, response.Message);
    }
    return response;
}

export const post_ = async (sessionId: string, url: string, bodyObj: unknown) => {
    const session = await SessionManager.getSession(sessionId);
    const accessToken = session ? session.accessToken : null;

    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    headers['Authorization'] = `Bearer ${accessToken}`;
    const body = JSON.stringify(bodyObj)
    const res = await fetch(url, {
        method: 'POST',
        body,
        headers
    });
    const response = await res.json();
    return response;
}
