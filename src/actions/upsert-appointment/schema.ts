import { z } from "zod"

export const upsertAppointmentSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, { message: "O paciente é obrigatório" }),
  doctorId: z.string().min(1, { message: "O médico é obrigatório" }),
  appointmentPrice: z.number().min(1, {
    message: "O valor da consulta é obrigatório",
  }),
  date: z.date({ message: "A data é obrigatória" }),
})
