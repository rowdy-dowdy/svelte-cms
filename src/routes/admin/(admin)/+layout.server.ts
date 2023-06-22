import { getCurrentUserAdmin } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({locals}) => {
  const user = await getCurrentUserAdmin(locals.session?.adminId)

  if (!user) {
    throw redirect(302, "/admin/login")
  }

  return {
    user
  }
}