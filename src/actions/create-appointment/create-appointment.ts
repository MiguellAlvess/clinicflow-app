"use server"

import dayjs from "dayjs"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { db } from "@/db"
import { appointmentsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/next-safe-action"

import { getAvailableTimes } from "../get-available-times/get-available-times"
import { createAppointmentSchema } from "./schema"

export const createAppointment = actionClient
  .schema(createAppointmentSchema)
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

    const availableTimes = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    })
    if (!availableTimes?.data) {
      throw new Error("No available times")
    }

    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    )
    if (!isTimeAvailable) {
      throw new Error("Time not available")
    }

    const appointmentData = {
      patientId: parsedInput.patientId,
      doctorId: parsedInput.doctorId,
      date: parsedInput.date,
      clinicId: session.user.clinic.id,
      appointmentPriceInCents: parsedInput.appointmentPrice * 100,
    }

    await db.insert(appointmentsTable).values(appointmentData)

    revalidatePath("/appointments")
    revalidatePath("/dashboard")
  })
