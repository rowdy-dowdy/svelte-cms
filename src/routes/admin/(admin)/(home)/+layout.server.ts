import { getCurrentUserAdmin } from '$lib/server/auth.js';
import db from '$lib/server/prismadb';
import { redirect } from '@sveltejs/kit';

export const load = async ({locals}) => {
  const dataTypes = await db.dataType.findMany()

  return {
    dataTypes
  }
}