"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { doctorsTable, patientsTable } from "@/db/schema"

import CreateAppointmentForm from "./create-appointment-form"

interface CreateAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[]
  doctors: (typeof doctorsTable.$inferSelect)[]
}

const CreateAppointmentButton = ({
  patients,
  doctors,
}: CreateAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar agendamento
        </Button>
      </DialogTrigger>
      <CreateAppointmentForm
        onSuccess={() => setIsOpen(false)}
        isOpen={isOpen}
        patients={patients}
        doctors={doctors}
      />
    </Dialog>
  )
}

export default CreateAppointmentButton
