import { DATA_FIELDS } from '$lib/admin/fields.js'
import type { FieldNameType } from '$lib/admin/fields.js'
import dbRaw from '$lib/server/knex.js'
import db from '$lib/server/prismadb.js'
import { fail } from '@sveltejs/kit'


export const load = async () => {

  return { scenes: [] }
}

export const actions = {
  createTable: async ({ cookies, request, url }) => {
    try {
      var { name, fields }: 
      {
        name: string, 
        fields: {
          id: string;
          field: FieldNameType
          name: string
        }[]
      } = await request.json()
  
      if (!checkField(name, fields)) {
        throw { errorText: 'Pay attention when entering table names and data fields'}
      }

      let sql = dbRaw.schema.createTable(name, (table) => {
        table.increments()

        fields.forEach(v => {
          switch(v.field) {
            case "Bool":
              table.boolean(v.name)
              break
            case "DateTime":
              table.dateTime(v.name)
              break
            case "Email":
              table.string(v.name)
              break
            case "File":
              table.string(v.name)
              break
            case "JSON":
              table.json(v.name)
              break
            case "Number":
              table.float(v.name)
              break
            case "Plain text":
              table.string(v.name)
              break
            case "Relation":
              table.string(v.name)
              break
            case "Rich text":
              table.text(v.name)
              break
            case "Select":
              table.string(v.name)
              break
            case "Url":
              table.string(v.name)
              break
          }
        })

        table.timestamps(true, true)

      }).toString()
  
      let sqlUpdateAt = `
        CREATE TRIGGER tg_${name}_updated_at
        AFTER UPDATE
        ON ${name} FOR EACH ROW
        BEGIN
          UPDATE ${name} SET updatedAt = current_timestamp
            WHERE id = old.id;
        END
      `
  
      const [dataType, _] = await db.$transaction([
        db.dataType.create({
          data: {
            name: name,
            dataRows: {
              create: fields.map((v) => ({
                id: v.id,
                name: v.name,
                field: v.field
              }))
            }
          },
          include: {
            dataRows: true
          }
        }),
        db.$executeRawUnsafe(sql),
        db.$executeRawUnsafe(sqlUpdateAt)
      ])
  
      return { data: dataType }
    }
    catch (e: any) {
      return fail(400, { error: e?.errorText || 'Server Error' });
    }
  },

  deleteTable: async ({request}) => {
    try {
      var { name, fields } = await request.json()

      let sql = dbRaw.schema.dropTable(name).toString()
  
      await db.$executeRawUnsafe(sql)
  
      return { "message": "Message Completed" }
    }
    catch (e: any) {
      return fail(400, { error: e?.errorText || 'Server Error' });
    }
  }
}

const checkField = (
  name: string | null,
  fields: {
    id: string;
    field: string; 
    name: string
  }[]
) => {
  if (name == null || fields.length == 0) return false

  let arr: string[] = []

  for(const field of fields) {
    if (arr.includes(field.name)) {
      return false
    }
    else {
      arr.push(field.name)
    }
  }

  return true
}