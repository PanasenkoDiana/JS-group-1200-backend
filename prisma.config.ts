import 'dotenv/config';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

const databaseURL = process.env['DATABASE_URL']

if (!databaseURL){
  throw new Error('DATABASE NOT FOUND')
}

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: databaseURL
    }
  }),
});
