"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db"
import { appointmentsTable } from "@/db/schema"
import { auth } from "@/lib/auth"

import { upsertAppointmentSchema } from "./schema"

export const upsertAppointment = async (data: unknown) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  if (!session.user.clinic) {
    redirect("/clinic-form")
  }

  const validatedData = upsertAppointmentSchema.parse(data)

  const appointmentData = {
    patientId: validatedData.patientId,
    doctorId: validatedData.doctorId,
    date: validatedData.date,
    clinicId: session.user.clinic.id,
    appointmentPriceInCents: validatedData.appointmentPrice * 100,
  }

  if (validatedData.id) {
    await db
      .update(appointmentsTable)
      .set({
        ...appointmentData,
        updatedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, validatedData.id))
  } else {
    await db.insert(appointmentsTable).values(appointmentData)
  }

  revalidatePath("/appointments")
  return { success: true, data: null }
}
