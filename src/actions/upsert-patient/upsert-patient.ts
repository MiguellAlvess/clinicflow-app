"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { db } from "@/db"
import { patientsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/next-safe-action"

import { upsertPatientSchema } from "./schema"

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session?.user) {
      throw new Error("Unauthorized")
    }
    if (!session?.user?.clinic?.id) {
      throw new Error("Clinic not found")
    }

    const cleanPhoneNumber = parsedInput.phoneNumber.replace(/\D/g, "")

    if (parsedInput.id) {
      await db
        .update(patientsTable)
        .set({
          name: parsedInput.name,
          email: parsedInput.email,
          phoneNumber: cleanPhoneNumber,
          sex: parsedInput.sex,
        })
        .where(eq(patientsTable.id, parsedInput.id))
    } else {
      await db.insert(patientsTable).values({
        clinicId: session.user.clinic.id,
        name: parsedInput.name,
        email: parsedInput.email,
        phoneNumber: cleanPhoneNumber,
        sex: parsedInput.sex,
      })
    }

    revalidatePath("/patients")
    revalidatePath("/dashboard")
  })
