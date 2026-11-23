import postgres, { type PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

// Мы создаём общее название для типа подключения к базе данных.
export type Database = PostgresClient<Contract>;

// Она принимает адрес базы данных и возвращает подключение.
export function createDb(url: string): Database {
	return postgres<Contract>({ contractJson, url });
}

import { Temporal } from "@js-temporal/polyfill";

Object.defineProperty(globalThis, "Temporal", {
	value: Temporal,
	writable: true,
	configurable: true,
});
