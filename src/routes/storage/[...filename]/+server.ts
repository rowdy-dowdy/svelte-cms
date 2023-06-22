import { error } from '@sveltejs/kit';
import * as fs from 'fs/promises';
import { existsSync } from "fs";

export const GET = async ({ params, request, cookies }) => {
  const filepath = './storage/' + params.filename

  console.log(filepath)

  if (!existsSync(filepath)){
    throw error(404, 'Not found');
  }

  const file_stream = await fs.readFile(filepath)

  return new Response(file_stream)
}