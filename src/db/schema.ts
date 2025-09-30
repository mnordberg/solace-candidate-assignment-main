import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
  index,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("specialties").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  firstNameIdx: index("first_name_idx").on(table.firstName),
  lastNameIdx: index("last_name_idx").on(table.lastName),
  cityIdx: index("city_idx").on(table.city),
  phoneNumberIdx: index("phone_number_idx").on(table.phoneNumber),
  specialtiesIdx: index("specialties_idx").using("gin", table.specialties),
}));

export { advocates };
