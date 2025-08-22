import "server-only"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@/db"
import { patientsTable } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getPatients = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.clinic?.id) return []

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
    orderBy: (patients, { desc }) => [desc(patients.createdAt)],
  })

  return patients
}
