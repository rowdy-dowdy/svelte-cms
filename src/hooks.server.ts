import db from "$lib/server/prismadb";
import { signToken, verifyToken } from "$lib/utils/jwt";
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/admin')) {
    const tokenAdmin = event.cookies.get('token_admin') || "token_admin"

    const decodedAdmin = await verifyToken(tokenAdmin)

    event.locals.session = {
      ...event.locals.session,
      adminId: decodedAdmin ? decodedAdmin.payload.sub! : null
    }
    
    // if (event.url.pathname.split('/')[1] == "admin" && event.locals.session == null) {
    //   return new Response('Redirect', {status: 303, headers: { Location: '/admin/login' }});
    // }
  }

  const response = await resolve(event)

  return response;
}