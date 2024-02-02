import { type RequestEvent, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Helper } from "../../../../../lib/utils/helper";
import { generateOtp } from "../../../../api/services/user";
import { redirect } from "sveltekit-flash-message/server";
import { successMessage } from "$lib/utils/message.utils";

export const load:PageServerLoad = async (event: RequestEvent) => {
    const sessionId = event.cookies.get('sessionId');
    let phone = event.url.searchParams.get('phone')
    let redirect = event.url.searchParams.get('redirect');
    let isOtpGenerated = false;
    console.log('Redirect ', redirect);
    console.log(phone);
    const patientId = event.params.patientId;

    phone = Helper.getAndValidatePhoneWithCountryCode(phone)

    console.log('Phone in load =', phone);
    if (!phone) {
        throw error(500,'Invalid url')
    }

    if (!redirect) {
        const response = await generateOtp(sessionId, phone, 'Login', 2);

        if (response.status === 'failure' || response.HttpCode !== 200) {
            throw error(500,`Unable to generate OTP : ${response.Message}`);
        }
    console.log('OTP GENERATE %%%%')
    isOtpGenerated = true;
    }
 
    return {
        phone,
        patientId,
        isOtpGenerated
    }
}

