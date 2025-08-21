"use client"

import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react"

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
  const doctorsInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("")
  const availability = getAvailability(doctor)
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
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm />
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default DoctorsCard
