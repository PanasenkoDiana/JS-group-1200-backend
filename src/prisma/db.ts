import { Temporal } from "@js-temporal/polyfill";
import postgres, { type PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

export type Database = PostgresClient<Contract>

export function createdb(url: string):Database{
	return postgres<Contract>({contractJson, url})
}

Object.defineProperty(globalThis, "Temporal", {
	value: Temporal,
	writable: true,
	configurable: true,
});

