import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({params, url}) => {
    const statusCode = url.searchParams.get('code');
    const phone = url.searchParams.get('phone');
    const patientId = params.patientId;
    
    if (!statusCode) {
        throw error(400, 'Oops! Something went wrong');
    }

    return {
        statusCode,
        phone,
        patientId
    }
}
