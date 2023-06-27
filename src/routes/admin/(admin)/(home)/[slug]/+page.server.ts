import type { FieldNameType } from '$lib/admin/fields.js'
import dbRaw from '$lib/server/knex.js'
import db from '$lib/server/prismadb.js'
import type { DataRow, DataType } from '@prisma/client'
import { error, fail } from '@sveltejs/kit'

export const load = async ({params, url}) => {
  let perPage = +(url.searchParams.get('perPage') || 5)
  let page = +(url.searchParams.get('page') || 1)
  if (page < 1) page = 1

  let offset = (page - 1) * perPage

  const [dataType, count, data] = await db.$transaction([
    db.dataType.findFirst({
      where: {
        name: params.slug
      },
      include: {
        dataRows: true
      }
    }),
    db.$queryRawUnsafe<{count: BigInt}[]>(dbRaw(params.slug).count('id as count').toString()),
    db.$queryRawUnsafe<any[]>(dbRaw.select('*').from(params.slug).offset(offset).limit(perPage).toString())
  ])

  if (!dataType) {
    throw error(404, {
      message: 'Not found'
    })
  }

  return { dataType, data, count: parseInt(count[0].count.toString()), page, perPage }
}

export const actions = {
  
}