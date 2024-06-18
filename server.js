import express from "express"; 
import { ruruHTML } from "ruru/server";
import { createYoga } from 'graphql-yoga';
import {schema} from './src/graphql/index.js'
import { setupDatabase } from "./src/graphql/database/db.js";


const yoga = createYoga({
  schema,
  context: async() => {
  const mongo = await setupDatabase();
  return {
    mongo,
  }
  }
});

const app = express();

// Correct the endpoint to '/graphql' to match the one used in ruruHTML
app.all('/graphql', yoga);

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.listen(4000, () => {
  console.log(`API running on http://localhost:4000
  Test: http://localhost:4000/graphql?query={hello}
  `);
});
