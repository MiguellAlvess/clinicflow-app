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
import { auth } from "@/lib/auth"

import AddDoctorButton from "./_components/add-doctor-button"
import DoctorsCard from "./_components/doctors-card"

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    redirect("/authentication")
  }
  if (!session.user.clinic) {
    redirect("/clinic-form")
  }
  const doctors = await getDoctors()

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencia os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorsCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default DoctorsPage
