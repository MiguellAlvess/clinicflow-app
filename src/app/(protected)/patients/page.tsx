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
import { getPatients } from "@/data/patient/get-patients"
import { auth } from "@/lib/auth"

import AddPatientButton from "./_components/add-patient-button"
import { patientsTableColumns } from "./_components/table-columns"

const PatientsPage = async () => {
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
  const patients = await getPatients()

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencia os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={patients} columns={patientsTableColumns} />
      </PageContent>
    </PageContainer>
  )
}

export default PatientsPage
