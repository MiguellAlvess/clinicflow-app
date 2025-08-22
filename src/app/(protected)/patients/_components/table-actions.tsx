"use client"

import { Edit, MoreVertical, Trash2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { toast } from "sonner"

import { deletePatient } from "@/actions/delete-patient/delete-patient"
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
import { Dialog } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { patientsTable } from "@/db/schema"

import UpsertPatientForm from "./upsert-patient-form"

type Patient = typeof patientsTable.$inferSelect

interface PatientsTableActionsProps {
  patient: Patient
}

const PatientsTableActions = ({ patient }: PatientsTableActionsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success("Paciente excluído com sucesso")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Ocorreu um erro ao excluir o paciente")
    },
  })

  const handleDeletePatientClick = () => {
    if (!patient) return
    deletePatientAction.execute({
      id: patient.id,
    })
  }

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
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
                  Ao deletar, os dados do paciente serão perdidos
                  permanentemente
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-2">
                <AlertDialogCancel className="flex-1">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="flex-1"
                  onClick={handleDeletePatientClick}
                >
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpsertPatientForm
        patient={patient}
        onSuccess={() => setIsEditOpen(false)}
        isOpen={isEditOpen}
      />
    </Dialog>
  )
}

export default PatientsTableActions
