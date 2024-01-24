<script lang="ts">
	// Import necessary modules and libraries
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	import { Modal } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Initialize variables for mobile number and OTP
	let mobileNumber = '';
	const validateMobileInput = () => {
    // Remove non-numeric characters from the input
    mobileNumber = mobileNumber.replace(/\D/g, '');

    // Limit the length to between 10 and 10 digits
    if (mobileNumber.length > 10) {
        mobileNumber = mobileNumber.slice(0, 10);
    } else if (mobileNumber.length < 10) {
        // Handle the case where the mobile number is less than 10 digits (optional)
        // You may choose to display an error message or take other actions here
    }
};

	let otp = ['', '', '', '', '', ''];

	// Array to hold references to OTP input elements
	let otpInputs: Array<HTMLInputElement> = [];

	// Function to handle OTP input and auto-focus
	const handleOtpInput = (index: number) => {
		// Remove non-numeric characters from the input
		otp[index] = otp[index].replace(/\D/g, '');

		// Auto-focus on the next input if available
		if (index < otpInputs.length - 1 && otp[index].length === 1) {
			otpInputs[index + 1].focus();
		}
	};

	// Function to handle form submission
	const handleSubmit = () => {
		// Trigger the modal before redirecting
		modalStore.trigger(modal);
	};

	// Function to handle confirmation after modal response
	const handleConfirm = () => {
		const otpValue = otp.join('');
		const routePath = `/patient/delete/confirm?mobile=${encodeURIComponent(mobileNumber)}`;
		console.log('Thank you! Deletion confirmed.');
		window.location.href = routePath;
	};

	// Function to handle cancellation after modal response
	const handleCancel = () => {
		console.log('Deletion cancelled.');
		// Handle cancellation logic here (e.g., close the modal)
	};

	// Modal settings
	const modal: ModalSettings = {
		type: 'confirm',
		title: 'Delete',
		body: 'Please note that once the account is deleted, all the associated data for your account will also be removed.',

		response: (r: boolean) => {
			console.log('response:', r);
			// Redirect only if the user confirms
			if (r) {
				const otpValue = otp.join('');
				const routePath = `/patient/delete/confirm?mobile=${encodeURIComponent(mobileNumber)}`;
				window.location.href = routePath;
			}
		}
	};

	// Function to get query parameters from the URL
	function getQueryParameter(key: string): string | null {
		const urlSearchParams = new URLSearchParams(window.location.search);
		return urlSearchParams.get(key);
	}

	 onMount(() => {
    // Get mobile number from query parameters if available
    const mobileQueryParam = getQueryParameter('mobile');
    if (mobileQueryParam) {
      // Limit the mobile number to 10 digits
      mobileNumber = mobileQueryParam.slice(0, 10);
    }
  });
</script>

<!-- Svelte component structure -->
<Modal background="bg-white text-black " on:confirm={handleConfirm} on:cancel={handleCancel} />

<!-- Fixed header with a specific color -->
<div class="fixed top-0 h-20 w-full bg-[#7165e3]"></div>

<!-- Main content area with a white background -->
<div class=" bg-white">
	<!-- Form for mobile number and OTP input -->
	<form on:submit|preventDefault={handleSubmit} class=" relative z-30">
		<div class="flex items-center justify-center h-screen">
			<div class="border-2 rounded-3xl py-16 px-8 bg-gray-100">
				<!-- Input field for mobile number -->
				<div class="text-start mb-4">
					<label for="mobile" class="block mb-2 text-black">Mobile no :</label>
					<input
						type="tel"
						bind:value={mobileNumber}
						on:input={validateMobileInput}
						pattern="[0-9]*"
						inputmode="numeric"
						placeholder=""
						class=" w-[280px] px-4 py-2 border rounded-xl text-gray-700"
						readonly={mobileNumber !== ''}
						required
					/>
				</div>

				<!-- Input fields for OTP -->
				<label for="otp" class="block mb-2 text-black"> Enter Otp :</label>
				<div class="flex gap-2">
					{#each Array(6) as _, i}
						<input
							type="tel"
							bind:value={otp[i]}
							on:input={() => handleOtpInput(i)}
							maxlength="1"
							pattern="[0-9]"
							inputmode="numeric"
							class="w-10 px-2 py-2 border rounded-md text-center text-gray-700"
							bind:this={otpInputs[i]}
							required
						/>
					{/each}
				</div>

				<!-- Submit button -->
				<div class="flex justify-center">
					<button type="submit" class="mt-8 px-28 py-2 bg-[#7165e3] text-white rounded-md"
						>Submit</button
					>
				</div>
			</div>
		</div>
	</form>
</div>

<!-- Fixed footer with a specific color -->
<div class=" fixed z-10 bottom-0 h-[400px] w-full bg-[#5832a1]"></div>
