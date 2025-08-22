"use client"

import { Edit, User } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import UpsertPatientForm from "./upsert-patient-form"

interface PatientsCardProps {
  patient: {
    id: string
    name: string
    email: string
    phoneNumber: string
    sex: "male" | "female"
    clinicId: string
    createdAt: Date
    updatedAt: Date | null
  }
}

const PatientsCard = ({ patient }: PatientsCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const formatPhoneNumber = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, "")

    // Aplica a máscara (##) #####-####
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }

    return phone
  }

  const getSexLabel = (sex: "male" | "female") => {
    return sex === "male" ? "Masculino" : "Feminino"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <User className="h-4 w-4" />
          {patient.name}
        </CardTitle>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <UpsertPatientForm
            patient={patient}
            onSuccess={() => setIsEditOpen(false)}
            isOpen={isEditOpen}
          />
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Email:</span> {patient.email}
          </div>
          <div>
            <span className="font-medium">Telefone:</span>{" "}
            {formatPhoneNumber(patient.phoneNumber)}
          </div>
          <div>
            <span className="font-medium">Sexo:</span>{" "}
            {getSexLabel(patient.sex)}
          </div>
          <div className="text-muted-foreground text-xs">
            Cadastrado em{" "}
            {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PatientsCard
