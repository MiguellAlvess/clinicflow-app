import { Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"

import { appointmentsTableColumns } from "../../appointments/_components/table-columns"

interface TodayAppointmentsTableProps {
  todayAppointments: {
    date: Date
    id: string
    appointmentPriceInCents: number
    createdAt: Date
    updatedAt: Date | null
    clinicId: string
    doctorId: string
    patientId: string
    doctor: {
      id: string
      name: string
      appointmentPriceInCents: number
      createdAt: Date
      updatedAt: Date | null
      clinicId: string
      avatarImageUrl: string | null
      specialty: string
      availableFromTime: string
      availableToTime: string
      availableFromWeekDay: number
      availableToWeekDay: number
    }
    patient: {
      id: string
      name: string
      createdAt: Date
      updatedAt: Date | null
      clinicId: string
      email: string
      phoneNumber: string
      sex: "male" | "female"
    }
  }[]
}

const TodayAppointmentsTable = ({
  todayAppointments,
}: TodayAppointmentsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calendar className="text-muted-foreground" />
          <CardTitle className="text-base">Agendamentos de hoje</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={appointmentsTableColumns}
          data={todayAppointments}
        />
      </CardContent>
    </Card>
  )
}

export default TodayAppointmentsTable
