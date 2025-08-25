import dayjs from "dayjs"
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
import { getDashboard } from "@/data/dashboard/get-dashboard"
import { auth } from "@/lib/auth"

import { DatePicker } from "./_components/date-picker"
import { RevenueChart } from "./_components/revenue-chart"
import StatsCards from "./_components/stats-cards"
import TodayAppointmentsTable from "./_components/today-appointments-table"
import TopDoctorsList from "./_components/top-doctors-list"
import TopSpecialtiesList from "./_components/top-specialties"

interface DashboardPageProps {
  searchParams: Promise<{
    from: string
    to: string
  }>
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    redirect("/authentication")
  }

  if (!session.user.clinic) {
    redirect("/clinic-form")
  }
  const { from, to } = await searchParams
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    )
  }
  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  } = await getDashboard({
    from,
    to,
    session: {
      user: {
        clinic: {
          id: session!.user.clinic!.id,
        },
      },
    },
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>Métricas da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalRevenue.total ? Number(totalRevenue.total) : null}
          totalAppointments={totalAppointments.total}
          totalPatients={totalPatients.total}
          totalDoctors={totalDoctors.total}
        />
        <div className="grid grid-cols-[2.5fr_1fr] gap-5">
          <RevenueChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctorsList doctors={topDoctors} />
        </div>
        <div className="grid grid-cols-[2.25fr_1fr] gap-5">
          <TodayAppointmentsTable todayAppointments={todayAppointments} />
          <TopSpecialtiesList topSpecialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default DashboardPage
