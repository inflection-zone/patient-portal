<script lang="ts">
	import { goto } from '$app/navigation';
    import type { PageServerData } from './$types'
    import Status from '$lib/components/status.svelte';
    export let data: PageServerData;
    $: statusCode = data.statusCode;
    const phone = data.phone;
    const patientId = data.patientId;

    $: console.log('STATUS CODE ',statusCode)

    const handleGenerateOtpClick = async (e) => {

        console.log('handling generate otp click...');
        const response = await fetch('/api/server/otp', {
            method: "POST",
            body: JSON.stringify({
                phone,
                purpose: 'Login'
            }),
            headers: {
				'content-type': 'application/json'
			}
        })

        const data = await response.json();
        console.log('OTP DATA', data);
        if (data.Status === 'failure' || data.HttpCode !== 200) {
            goto(`/patient/${patientId}/delete/confirm/status?code=${data.Message}`)
        } else {
            goto(`/patient/${patientId}/delete/confirm/?mobile=${phone}`);
        }
    }

    const handleReenterOtpClick = () => {
        console.log('handling re enter otp click...');
        goto(`/patient/${patientId}/delete/confirm/?mobile=${phone}`);
    }
</script>
<div  >
    {#if statusCode === 'cancel'}
    <Status title={"Cancel"} message={'Thank you for continuing our service!'} generateOtp={false}  invalidOtp={false}></Status>
        <!-- <h1>Thank you for continuing our service!</h1> -->
    {:else if statusCode === 'success'}
    <Status title={"Success"} message={'Successfully deleted all your records!'} generateOtp={false}  invalidOtp={false} ></Status>
        <!-- <h1>Successfully deleted all your records! </h1> -->
        {:else if statusCode === 'invalidotp'}
        <Status on:reenterOtp={handleReenterOtpClick} title={"Invalid OTP"} message={'OTP is invalid! Please re enter the OTP'} generateOtp={false} invalidOtp={true} ></Status>
        {:else if statusCode === 'regenerate'}
        <Status on:generateOtp={handleGenerateOtpClick} title={"OTP Expired"} message={'OTP is expired! Please re generate the OTP'} invalidOtp={false} generateOtp={true}></Status>
        {:else}
        <Status title={"Alert"} message={statusCode} generateOtp={false}  invalidOtp={false}></Status>
            <!-- <h1>{statusCode}</h1> -->
    {/if}
</div>
