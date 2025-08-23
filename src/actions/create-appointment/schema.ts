import { z } from "zod"

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, { message: "O paciente é obrigatório" }),
  doctorId: z.string().min(1, { message: "O médico é obrigatório" }),
  appointmentPrice: z.number().min(1, {
    message: "O valor da consulta é obrigatório",
  }),
  date: z.date({ message: "A data é obrigatória" }),
  time: z.string(),
})
