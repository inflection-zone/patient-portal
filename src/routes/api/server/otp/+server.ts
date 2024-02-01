import { error, redirect, type RequestEvent } from "@sveltejs/kit";
import { confirmAndDelete, generateOtp, loginWithOtp } from "../../services/user";

//////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
    console.log('Server otp post get called...')
    const sessionId = event.cookies.get('sessionId');
	const request = event.request;
	const data = await request.json();
    const phone = data.phone;
    const purpose = data.purpose;
    const loginRoleId = data.loginRoleId ?? 2;
    // const mobileNumber = data.mobileNumber;
    let response;

    try {
        response = await generateOtp(sessionId!, phone, purpose, loginRoleId)
        // const data = await response.json();
        console.log('Response OTP at +server.ts', response);

        return new Response(JSON.stringify({
            Status: response.Status,
            Message: response.Message,
            HttpCode: response.HttpCode
            })
        )
   	} catch (err:any) {
        console.log('Response at OTP error +server.ts', response);
		return new Response(JSON.stringify({
            Status: 'failure',
            Message: err.message,
            HttpCode: response.HttpCode
            }),
        );
	}
};
