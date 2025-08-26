import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { DataTable } from "@/components/ui/data-table"
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container"
import { getAppointments } from "@/data/appointment/get-appointments"
import { getDoctors } from "@/data/doctor/get-doctors"
import { getPatients } from "@/data/patient/get-patients"
import { auth } from "@/lib/auth"

import CreateAppointmentButton from "./_components/create-appointment-button"
import { appointmentsTableColumns } from "./_components/table-columns"

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    redirect("/authentication")
  }
  if (!session.user.clinic) {
    redirect("/clinic-form")
  }
  if (!session?.user.plan) {
    redirect("/new-subscription")
  }

  const [patients, doctors, appointments] = await Promise.all([
    getPatients(),
    getDoctors(),
    getAppointments(),
  ])

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <CreateAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={appointments} columns={appointmentsTableColumns} />
      </PageContent>
    </PageContainer>
  )
}

export default AppointmentsPage
