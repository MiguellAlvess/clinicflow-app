"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { appointmentsTable } from "@/db/schema"

import AppointmentsTableActions from "./table-actions"

type Appointment = typeof appointmentsTable.$inferSelect & {
  doctor: {
    name: string
    specialty: string
  }
  patient: {
    name: string
    email: string
  }
}

export const appointmentsTableColumns: ColumnDef<Appointment>[] = [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "Paciente",
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: "Médico",
    cell: ({ row }) => {
      const appointment = row.original
      return `${appointment.doctor.name} - ${appointment.doctor.specialty}`
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Data e Hora",
    cell: ({ row }) => {
      const date = row.original.date
      return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    },
  },
  {
    id: "appointmentPriceInCents",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: ({ row }) => {
      const price = row.original.appointmentPriceInCents
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price / 100)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original
      return <AppointmentsTableActions appointment={appointment} />
    },
  },
]
