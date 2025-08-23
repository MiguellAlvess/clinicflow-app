"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import { toast } from "sonner"
import { z } from "zod"

import { upsertAppointment } from "@/actions/upsert-appointment/upsert-appointment"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { doctorsTable, patientsTable } from "@/db/schema"

const appointmentSchema = z.object({
  patientId: z.string().min(1, { message: "O paciente é obrigatório" }),
  doctorId: z.string().min(1, { message: "O médico é obrigatório" }),
  appointmentPrice: z.number().min(1, {
    message: "O valor da consulta é obrigatório",
  }),
  date: z.date({ message: "A data é obrigatória" }),
  time: z.string().min(1, { message: "O horário é obrigatório" }),
})

interface UpsertAppointmentFormProps {
  isOpen: boolean
  patients: (typeof patientsTable.$inferSelect)[]
  doctors: (typeof doctorsTable.$inferSelect)[]
  onSuccess?: () => void
}

const UpsertAppointmentForm = ({
  patients,
  doctors,
  onSuccess,
  isOpen,
}: UpsertAppointmentFormProps) => {
  const [date, setDate] = useState<Date>()
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")

  const form = useForm<z.infer<typeof appointmentSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentPrice: 0,
      date: undefined,
      time: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: "",
        doctorId: "",
        appointmentPrice: 0,
        date: undefined,
        time: "",
      })
      setDate(undefined)
      setSelectedDoctor("")
    }
  }, [isOpen, form])

  useEffect(() => {
    if (selectedDoctor) {
      const doctor = doctors.find((d) => d.id === selectedDoctor)
      if (doctor) {
        form.setValue("appointmentPrice", doctor.appointmentPriceInCents / 100)
      }
    }
  }, [selectedDoctor, doctors, form])

  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success("Agendamento criado com sucesso")
      onSuccess?.()
    },
    onError: (error) => {
      console.error(error)
      toast.error("Ocorreu um erro ao criar o agendamento")
    },
  })

  const onSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    const dateTime = new Date(values.date)
    const [hours, minutes] = values.time.split(":")
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    upsertAppointmentAction.execute({
      ...values,
      date: dateTime,
      appointmentPrice: values.appointmentPrice,
    })
  }

  const isFormDisabled = !form.watch("patientId") || !form.watch("doctorId")

  return (
    <DialogContent className="max-w-md">
      <DialogHeader className="flex items-center justify-center">
        <DialogTitle>Adicionar agendamento</DialogTitle>
        <DialogDescription>
          Preencha as informações para criar um novo agendamento
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedDoctor(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue)
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$"
                  disabled={!selectedDoctor}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                        disabled={isFormDisabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate)
                        field.onChange(newDate)
                      }}
                      disabled={(date) => date < new Date()}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isFormDisabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="08:00:00">08:00</SelectItem>
                    <SelectItem value="08:30:00">08:30</SelectItem>
                    <SelectItem value="09:00:00">09:00</SelectItem>
                    <SelectItem value="09:30:00">09:30</SelectItem>
                    <SelectItem value="10:00:00">10:00</SelectItem>
                    <SelectItem value="10:30:00">10:30</SelectItem>
                    <SelectItem value="11:00:00">11:00</SelectItem>
                    <SelectItem value="11:30:00">11:30</SelectItem>
                    <SelectItem value="14:00:00">14:00</SelectItem>
                    <SelectItem value="14:30:00">14:30</SelectItem>
                    <SelectItem value="15:00:00">15:00</SelectItem>
                    <SelectItem value="15:30:00">15:30</SelectItem>
                    <SelectItem value="16:00:00">16:00</SelectItem>
                    <SelectItem value="16:30:00">16:30</SelectItem>
                    <SelectItem value="17:00:00">17:00</SelectItem>
                    <SelectItem value="17:30:00">17:30</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isFormDisabled} className="w-full">
              Criar agendamento
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

export default UpsertAppointmentForm
