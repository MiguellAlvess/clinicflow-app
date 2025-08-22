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
import { getPatients } from "@/data/patient/get-patients"
import { auth } from "@/lib/auth"

import AddPatientButton from "./_components/add-patient-button"
import PatientsCard from "./_components/patients-card"

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
        <div className="grid grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientsCard key={patient.id} patient={patient} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default PatientsPage
