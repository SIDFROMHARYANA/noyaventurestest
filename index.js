const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'functionup',
  port: 5432,
});

fastify.get('/:id', async (req,res) => {
  res.send(
  {
      id: req.params.id,
      doctor:"vilas",
      organization:"jagdale clinic",
      isActive: 1
  }
)
}
)



fastify.post('/doctors', async (request, reply) => {
  // we can use the `request.body` object to get the data sent by the client
  const { 
      id,
      firstname,
      lastname,
      email,
      isActive

  } = request.body
  const result =  await pool.query(
    'INSERT INTO doctors (id, firstname, lastname, email, isActive) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, firstname, lastname, email, isActive]
  );
    return result;
})

fastify.post('/organization', async (request, reply) => {
  // we can use the `request.body` object to get the data sent by the client
  const { 
      id,
      name,
      Address

  } = request.body
  const result =  await pool.query(
    'INSERT INTO organization (id, name, Address) VALUES ($1, $2, $3) RETURNING *',
    [id,name, Address]
  );
    return result;
})

fastify.get('/organization/:id', async (request, reply) => {
  const { id } = request.params;
  const { rows } = await pool.query('SELECT * FROM doctorsbyorganization WHERE id = $1', [id]);
  reply.send(rows[0]);
});

fastify.put('/organization/:id', async (request, reply) => {
  // we can use the `request.body` object to get the data sent by the client
  const { 
      
      name,
      Address

  } = request.body
  const result =await pool.query(
    'UPDATEOne ({_id: new ObjectId(request.params.id)})' ,
    {
    $set: {
    name,
    Address
    }
  }, {upsert:true})
    return result;
})




fastify.delete('/organization/:id', async (request, reply) => {
  const { id } = request.params;
  const { rows } = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [id]);
  reply.send(rows[0]);
});

fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
