import "server-only"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@/db"
import { doctorsTable } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getDoctors = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.clinic?.id) return []

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session?.user.clinic?.id),
  })

  return doctors
}
