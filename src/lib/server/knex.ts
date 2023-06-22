import knex from 'knex'

const dbRaw = knex({
  client: 'sqlite3'
})

// knex('table').insert({a: 'b'}).returning('*').toString();
// "insert into "table" ("a") values ('b')"

export default dbRaw