import { RequestEvent, error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { Helper } from "../../../../../lib/utils/helper";

export const load:PageServerLoad = async ({params, url}) => {
    let phone = url.searchParams.get('phone')

    console.log(phone);
    const patientId = params.patientId;

    phone = Helper.getAndValidatePhoneWithCountryCode(phone)

    console.log('Phone in load =', phone);
    if (!phone) {
        throw error(500,'Invalid url')
    }
    return {
        phone,
        patientId
    }
}

export const actions = {

	default: async (event: RequestEvent) => {
        // console.log('Inside defult action.');
        // const request = event.request;
        // const data = await request.formData(); // or .json(), or .text(), etc
        // console.log(Object.fromEntries(data));
    }
};

