"use client"
import { ColumnDef } from "@tanstack/react-table"

import { patientsTable } from "@/db/schema"

import PatientsTableActions from "./table-actions"

type Patient = typeof patientsTable.$inferSelect

export const patientsTableColumns: ColumnDef<Patient>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Telefone",
    cell: ({ row }) => {
      const phone = row.original.phoneNumber as string | undefined
      if (!phone) return "-"
      const match = phone.match(/^(\d{2})(\d{5})(\d{4})$/)
      if (!match) return phone
      return `(${match[1]}) ${match[2]}-${match[3]}`
    },
  },
  {
    id: "sex",
    accessorKey: "sex",
    header: "Sexo",
    cell: (params) => {
      const patient = params.row.original
      return patient.sex === "male" ? "Masculino" : "Feminino"
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const patient = params.row.original
      return <PatientsTableActions patient={patient} />
    },
  },
]
