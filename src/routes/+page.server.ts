import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { generateOtp } from './api/services/user';
import { redirect } from 'sveltekit-flash-message/server';
import { errorMessage, successMessage } from '$lib/utils/message.utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
	event.depends('app')
};

export const actions = {
	generateOtp: async (event: RequestEvent) => {
		const request = event.request;
		const formData = Object.fromEntries(await request.formData());
        console.log('FORM DATA', formData);
        let countryCode = (formData.countryCode as string).trim();
        countryCode = countryCode.replace('+','');
        const phone = countryCode+'-'+formData.phone as string;
        const response = await generateOtp(phone, "Login");
        console.log('Login Response ', response);
        if (response.Status == "failure" || response.HttpCode !== 200) {
            throw redirect('/', errorMessage(response.Message), event);
        }
        throw redirect(`/users?phone=${countryCode}-${formData.phone as string}`, successMessage(response.Message), event);
	}
};
