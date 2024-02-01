// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
        sessionUser: {
            sessionId      ?: string;
            userId         ?: string;
            email          ?: string;
            username       ?: string;
            profileImageUrl?: string;
            fullName       ?: string;
            firstName      ?: string;
            roleId         ?: string;
          };
    }
	// interface PageData {}
	interface Error {
        message : string;
        code   ?: number;
        userId ?: string;
        stack  ?: string;
    }
	// interface Platform {}
}
