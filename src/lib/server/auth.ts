import db from "$lib/server/prismadb";
import type { Admin } from "@prisma/client";

function exclude(user: any, ...keys: any) {
  if (user == null) return null

  for (let key of keys) {
    delete user[key]
  }
  return user
}

export type UserAdminType = Omit<Admin, 'password'> | null

export const getCurrentUserAdmin = async (adminId: string | null) => {
  if (!adminId) return null

  const user = await db.admin.findUnique({
    where: {
      id: +adminId
    }
  })

  const userWithoutPassword: UserAdminType = exclude(user, ['password'])

  return userWithoutPassword
}