"use client"

import { MoreVertical, Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { deleteAppointment } from "@/actions/delete-appointment/delete-appointment"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { appointmentsTable } from "@/db/schema"

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

interface AppointmentsTableActionsProps {
  appointment: Appointment
}

const AppointmentsTableActions = ({
  appointment,
}: AppointmentsTableActionsProps) => {
  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success("Agendamento excluído com sucesso")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Ocorreu um erro ao excluir o agendamento")
    },
  })

  const handleDeleteAppointmentClick = () => {
    if (!appointment) return
    deleteAppointmentAction.execute({
      id: appointment.id,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Agendamento - {appointment.patient.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent className="space-y-3">
            <AlertDialogHeader className="flex items-center justify-center">
              <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
              <AlertDialogDescription>
                Ao deletar, os dados do agendamento serão perdidos
                permanentemente
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2">
              <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="flex-1"
                onClick={handleDeleteAppointmentClick}
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AppointmentsTableActions
