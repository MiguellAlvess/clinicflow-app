import "server-only"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@/db"
import { appointmentsTable } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getAppointments = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.clinic?.id) return []

  const appointments = await db.query.appointmentsTable.findMany({
    where: eq(appointmentsTable.clinicId, session.user.clinic.id),
    with: {
      doctor: true,
      patient: true,
    },
    orderBy: (appointments, { desc }) => [desc(appointments.date)],
  })

  return appointments
}
