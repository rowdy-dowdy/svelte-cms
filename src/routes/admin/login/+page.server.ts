import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt'
import { removeSpace } from '$lib/utils/validator'
import { signToken } from '$lib/utils/jwt'
import db from '$lib/server/prismadb.js';

export const load = async ({ locals }) => {
  if (locals.session?.adminId) {
    throw redirect(302, "/admin")
  }

  return {};
}

export const actions = {
  login: async ({ cookies, request, url }) => {
    const data = await request.formData()

    let email: string = removeSpace(data.get('email') as unknown as string || ''),
      password: string = data.get('password') as string || '',
      remember: boolean = data.get('remember') as unknown as boolean || false

    const userData = await db.admin.findUnique({
      where: {
        email: email
      }
    })

    if (!userData) {
      return fail(400, { email, remember, error: 'Email not found' });
    }

    if (!await bcrypt.compare(password, userData.password || '')) {
      return fail(400, { email, remember, error: 'Password is corrected' });
    }

    // const userWithoutPassword = exclude(userData, ['password'])

    const token = await signToken(userData.id, remember ? "60d" : "1d")


    cookies.set('token_admin', token, { path: '/', httpOnly: true, secure: false, maxAge: remember ? 86400 * 60 : 86400 })

    throw redirect(302, url.searchParams.get('redirect_url') || "/admin")
  },
  register: async (event) => {
    // TODO register the user
  },
  logout: async (event) => {
    event.cookies.delete('token_admin', { path: '/', httpOnly: true, secure: false, })
    event.locals.session.adminId = null

    return { success: true }
  }
};

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key]
  }
  return user
}