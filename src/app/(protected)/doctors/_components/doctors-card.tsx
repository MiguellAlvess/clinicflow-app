"use client"

import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { toast } from "sonner"

import { deleteDoctor } from "@/actions/delete-doctor/delete-doctor"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { doctorsTable } from "@/db/schema"
import { currencyFormatter } from "@/helpers/currency"

import { getAvailability } from "../_helpers/availability"
import UpsertDoctorForm from "./upsert-doctor-form"

interface DoctorsCardProps {
  doctor: typeof doctorsTable.$inferSelect
}

const DoctorsCard = ({ doctor }: DoctorsCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const doctorsInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("")
  const availability = getAvailability(doctor)
  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success("Médico excluido com sucesso")
    },
    onError: (error) => {
      console.error(error)
      toast.error("Ocorreu um erro ao excluir o médico")
    },
  })

  const handleDeleteDoctorClick = () => {
    if (!doctor) return
    deleteDoctorAction.execute({
      id: doctor.id,
    })
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-2xl">
              {doctorsInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="tex-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-xs">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          {availability.from.format("dddd")} à {availability.to.format("dddd")}
        </Badge>
        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          {availability.from.format("HH:mm")} às{" "}
          {availability.to.format("HH:mm")}
        </Badge>
        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {currencyFormatter(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              Deletetar médico
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="space-y-3">
            <AlertDialogHeader className="flex items-center justify-center">
              <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
              <AlertDialogDescription>
                Ao deletar, os dados do médico serão perdidos permanentemente
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2">
              <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="flex-1"
                onClick={handleDeleteDoctorClick}
              >
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            onSuccess={() => setIsOpen(false)}
            doctor={{
              ...doctor,
              availableFromTime: availability.from.format("HH:mm:ss"),
              availableToTime: availability.to.format("HH:mm:ss"),
            }}
          />
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default DoctorsCard
