import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container"
import { getDoctors } from "@/data/doctor/get-doctors"
import { getPatients } from "@/data/patient/get-patients"
import { auth } from "@/lib/auth"

import AddAppointmentButton from "./_components/add-appointment-button"

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

  const [patients, doctors] = await Promise.all([getPatients(), getDoctors()])

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
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="text-muted-foreground text-center">
          <p>Lista de agendamentos será implementada em breve.</p>
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default AppointmentsPage
