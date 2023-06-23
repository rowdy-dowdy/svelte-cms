import db from '$lib/server/prismadb.js'
import { error, fail } from '@sveltejs/kit'

export const load = async ({params}) => {
  const { dataType, data } = await getData(params.slug)

  console.log({data, dataType})

  if (!dataType) {
    throw error(404, {
      message: 'Not found'
    });
  }

  return { dataType, data }
}

export const actions = {
}

const getData = async (name: string) => {
  try {
    const [dataType, data] = await db.$transaction([
      db.dataType.findFirst({
        where: {
          name: name
        },
        include: {
          dataRows: true
        }
      }),
      db.$queryRawUnsafe(`select * from ${name}`)
    ])

    return {dataType, data}
  } 
  catch (error) {
    console.log({error})
    return {dataType: null, data: []}
  }
}