import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';


const isPublicRoute = createRouteMatcher([
	'/',                              // Home page
	'/sign-in(.*)',                   // Página de login
	'/sign-up(.*)',                   // Página de registro
	'/for-sale',                      // Listados públicos
	'/for-sale/(.*)',                 // Detalles de propiedades
	'/for-rent',                      // Rentas públicas
	'/for-rent/(.*)',                 // Detalles de rentas
	'/agent-finder',                  // Buscador de agentes
	'/agent-finder/(.*)',             // Perfiles de agentes
	'/api/webhooks/clerk(.*)',        // Webhooks de Clerk
	'/api/public(.*)',                // APIs públicas
]);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect()
	}
})



export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};