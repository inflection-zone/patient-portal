import { error, redirect, type RequestEvent } from "@sveltejs/kit";
import { confirmAndDelete, loginWithOtp } from "../../services/user";
import { SessionManager } from "../../../api/session.manager";
import { CookieUtils } from "$lib/utils/cookie.utils";
import { goto } from "$app/navigation";

//////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
    console.log('Server post get called...')
	const request = event.request;
	const data = await request.json();
    const otp = data.otp;
    const mobileNumber = data.mobileNumber;
    const patientId = data.patientId;
    let response;
    try {
        // response = await confirmAndDelete(otp, mobileNumber, patientId)
        response = await loginWithOtp(otp, mobileNumber);
        // data1 = await loginResponse.json();
        console.log('Login Response ', response)
        if (response.Status === 'failure' || response.HttpCode !== 200) {
            throw new Error(response.Message)
        }
            
        console.log('Response at +server.ts', response);

        const user = response.Data.User;
        user.SessionId = response.Data.SessionId;
        const accessToken = response.Data.AccessToken;
        const expiryDate = new Date(response.Data.SessionValidTill);
        const sessionId = response.Data.SessionId;
        const userId: string = response.Data.User.id;

        const session = await SessionManager.constructSession(user, accessToken, expiryDate);
        if (!session) {
            console.log(`Session cannot be constructed!`);
            throw new Error(`Session cannot be constructed`);
            // throw redirect(303, `/sign-in`, errorMessage(`Use login session cannot be created!`), event);
        }
        console.log('Session - ' + JSON.stringify(session, null, 2));
        const userSession = await SessionManager.addSession(session.sessionId, session);
        console.log(JSON.stringify(userSession, null, 2));

        CookieUtils.setCookieHeader(event, 'sessionId', sessionId);


        return new Response(JSON.stringify({
            Status: response.Status,
            Message: response.Message,
            HttpCode: response.HttpCode
            })
        )
   	} catch (err:any) {
        console.log('Response at error +server.ts', response);
		return new Response(JSON.stringify({
            Status: 'failure',
            Message: err.message,
            HttpCode: response.HttpCode
            }),
        );
	}
};
