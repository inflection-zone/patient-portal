import type { LoginModel } from "$lib/types/domain.models";
import { API_CLIENT_INTERNAL_KEY, BACKEND_API_URL } from "$env/static/private";
import { Helper } from "$lib/utils/helper";
import { delete_, post_ } from "./common";

export const loginWithOtp = async (otp: string, phone: string, loginRoleId: number = 2) => {

    const model: LoginModel = getLoginModel(otp, phone, loginRoleId);
    console.log(JSON.stringify(model, null, 2));

    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;
    const body = JSON.stringify(model);
    const url = BACKEND_API_URL + '/users/login-with-otp';

    console.log(body);
    console.log(url);
    console.log(JSON.stringify(headers, null, 2));

    const res = await fetch(url, {
        method: 'POST',
        body,
        headers
    });
    const response = await res.json();
    return response;
};

const getLoginModel = (otp: string, phone: string, loginRoleId: number): LoginModel => {
    const loginModel: LoginModel = {
        Phone: Helper.sanitizePhone(phone),
        LoginRoleId: loginRoleId ?? 2,
    };
    if (Helper.isOtp(otp)) {
        loginModel.Otp = otp;
    }
    return loginModel;
}

export const confirmAndDelete = async (otp: string, mobileNumber: string, patientId: string, loginRoleId: number = 2) => {
    console.log('Confirm & delete get called...')
    const loginResponse = await loginWithOtp(otp, mobileNumber);
    console.log('Login Response ', loginResponse)
    if (loginResponse.Status === 'failure' || loginResponse.HttpCode !== 200) {
        throw new Error(loginResponse.Message)
    }

    const accessToken = loginResponse.Data.AccessToken;
    console.log('Patient id ', patientId);
    const url = BACKEND_API_URL + `/patients/${patientId}`;
    const deleteResponse = await deletePatient(accessToken, url);
    console.log('Delete Response ', deleteResponse)
    if (loginResponse.Status === 'failure' || loginResponse.HttpCode !== 200) {
        throw new Error(deleteResponse.Message);
    }
    return new Response(
        JSON.stringify({
            Status: deleteResponse.Status,
            HttpCode: deleteResponse.HttpCode,
            Message: deleteResponse.Message
            }),
            {
                status:200,

            }
        )
    }


export const deletePatient = async (sessionId: string, patientId: string) => {
    const url = BACKEND_API_URL + `/patients/${patientId}`;
    return await delete_(sessionId, url);
}

export const generateOtp = async (sessionId: string, phone: string, purpose: string, loginRoleId: number) => {
    const url = BACKEND_API_URL + `/users/generate-otp`;
    const body = {
        Phone: `+91-${phone}`,
        Purpose: purpose,
        RoleId: loginRoleId
    }
    return await post_(sessionId, url, body);

    // const headers = {};
    // headers['Content-Type'] = 'application/json';
    // headers['x-api-key'] = API_CLIENT_INTERNAL_KEY;

    // const model= {
    //     Phone: phone,
    //     Purpose: purpose,
    //     LoginRoleId: loginRoleId
    // }
    // const body = JSON.stringify(model);
    // const url = BACKEND_API_URL + '/users/generate-otp';

    // const res = await fetch(url, {
    //     method: 'POST',
    //     body,
    //     headers
    // });

    // const response = await res.json();

    // if (response.Status === 'failure' || response.HttpCode !== 200) {
    //     throw new Error(response.Message)
    // }
    // return response;
}
