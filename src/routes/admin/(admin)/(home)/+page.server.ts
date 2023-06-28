import { DATA_FIELDS } from '$lib/admin/fields.js'
import type { FieldNameType } from '$lib/admin/fields.js'
import dbRaw from '$lib/server/knex.js'
import db from '$lib/server/prismadb.js'
import type { DataRow } from '@prisma/client'
import { fail, redirect } from '@sveltejs/kit'


export const load = async ({ parent }) => {
  const { dataTypes } = await parent()

  if (dataTypes.length > 0) {
    throw redirect(302, `/admin/${dataTypes[0].name}`);
  }

  return { dataTypes }
}

export const actions = {
  createUpdateTable: async ({ cookies, request, url }) => {
    try {
      var { name, fields, id }: 
      {
        name: string, 
        id: string,
        fields: {
          id: string;
          field: FieldNameType
          name: string
        }[]
      } = await request.json()

      if (id) {
        await db.$transaction([
          db.dataRow.deleteMany({
            where: {
              dataTypeId: id
            }
          }),
          db.dataType.delete({
            where: {
              id: id
            }
          }),
          db.$executeRawUnsafe(dbRaw.schema.dropTable(name).toString()),
        ])
      }
  
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
            case "File":
            case "Plain text":
            case "Url":
            case "Select":
              table.string(v.name)
              break
            case "JSON":
              table.json(v.name)
              break
            case "Number":
              table.float(v.name)
              break
            case "Rich text":
              table.text(v.name)
              break
          }
        })
    
        table.timestamp('createdAt').defaultTo(dbRaw.fn.now())
        table.timestamp('updatedAt').defaultTo(dbRaw.fn.now())
    
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
    
      await db.$transaction([
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
  
      return { "message": "Message Completed" }
    }
    catch (e: any) {
      console.log({e})
      return fail(400, { error: e?.errorText || 'Server Error' })
    }
  },

  deleteTable: async ({request}) => {
    try {
      var { id, name } = await request.json()

      let sql = dbRaw.schema.dropTable(name).toString()

      await db.$transaction([
        db.dataRow.deleteMany({
          where: {
            dataTypeId: id
          }
        }),
        db.dataType.delete({
          where: {
            id: id
          }
        }),
        db.$executeRawUnsafe(sql),
      ])
  
      return { "message": "Message Completed" }
    }
    catch (e: any) {
      return fail(400, { error: e?.errorText || 'Server Error' });
    }
  },

  addEditRecord: async ({request}) => {
    try {
      var { editId, name, fields }: 
      { 
        name: string, 
        editId?: string, 
        fields: (Omit<DataRow, 'field'> & {
          value: any
          field: FieldNameType
        })[] 
      } = await request.json()
  
      if (!name) {
        throw { errorText: 'Error'}
      }

      let sql = ''

      console.log(fields)

      if (editId) {
        // update record
        sql = dbRaw(name).where('id', editId).update(
          fields.reduce<any>((pre, cur) => {
          if (cur.field == "Bool") {
            pre[cur.name] = cur.value ? 1 : 0
          }
          else {
            pre[cur.name] = cur.value
          }
  
          return pre
        },{})).toString()
      }
      else {
        // create record
        sql = dbRaw(name).insert(fields.reduce<any>((pre, cur) => {
          if (cur.field == "Bool") {
            pre[cur.name] = cur.value ? 1 : 0
          }
          else {
            pre[cur.name] = cur.value
          }
  
          return pre
        },{})).toString()
      }

  
      await db.$executeRawUnsafe(sql)
  
      return { message: "Mission Completed" }
    }
    catch (e: any) {
      console.log({e})
      return fail(400, { error: e?.errorText || 'Server Error' });
    }
  },

  deleteRecord: async ({request}) => {
    try {
      var { id, name }: { id: string, name: string } = await request.json()
  
      if (!id || !name) {
        throw { errorText: 'Error'}
      }

      let sql = dbRaw(name).where('id', id).del().toString()
  
      await db.$executeRawUnsafe(sql)
  
      return { message: "Mission Completed" }
    }
    catch (e: any) {
      console.log({e})
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