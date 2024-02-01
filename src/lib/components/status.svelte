<script lang="ts">
	import { goto } from '$app/navigation';
    import { createEventDispatcher } from 'svelte';
    export let title: string;
    export let message: string;
    export let generateOtp: boolean;
    export let invalidOtp: boolean;

    const dispatch = createEventDispatcher();

    const handleRegenerateOtp = () => {
        dispatch('generateOtp');
    }

    const handleReenterOtp = () => {
        dispatch('reenterOtp');
    }
</script>

<h1>{title}</h1><br>
<br>
<h2>{message}</h2>
<br>
{#if generateOtp}
    <button on:click={handleRegenerateOtp}> Generate OTP</button>
{/if}
<br>
{#if invalidOtp}
    <button on:click={handleReenterOtp}> Ok</button>
{/if}

