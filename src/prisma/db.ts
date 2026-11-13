import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});

import { Temporal } from "@js-temporal/polyfill";

Object.defineProperty(globalThis, 'Temporal', {
  value: Temporal,
  writable: true,
  configurable: true,
});