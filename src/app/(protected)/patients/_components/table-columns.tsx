"use client"
import { ColumnDef } from "@tanstack/react-table"
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { patientsTable } from "@/db/schema"

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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="m h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <EditIcon className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrashIcon className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
