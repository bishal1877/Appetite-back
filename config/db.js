import { config } from "dotenv";

config();

import { neon } from "@neondatabase/serverless";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

export default sql;
