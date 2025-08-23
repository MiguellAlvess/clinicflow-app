"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { upsertPatient } from "@/actions/upsert-patient/upsert-patient"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { patientsTable } from "@/db/schema"

const patientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "O nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "O telefone é obrigatório" }),
  sex: z.enum(["male", "female"], { message: "O sexo é obrigatório" }),
})

interface UpsertPatientFormProps {
  isOpen: boolean
  patient?: typeof patientsTable.$inferInsert
  onSuccess?: () => void
}

const UpsertPatientForm = ({
  patient,
  onSuccess,
  isOpen,
}: UpsertPatientFormProps) => {
  const form = useForm<z.infer<typeof patientSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(patientSchema),
    defaultValues: {
      id: patient?.id,
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      sex: patient?.sex ?? "male",
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(patient)
    }
  }, [isOpen, form, patient])

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(
        patient
          ? "Paciente atualizado com sucesso"
          : "Paciente adicionado com sucesso",
      )
      onSuccess?.()
    },
    onError: (error) => {
      console.error(error)
      toast.error(
        patient
          ? "Ocorreu um erro ao atualizar o paciente"
          : "Ocorreu um erro ao adicionar o paciente",
      )
    },
  })

  const onSubmit = (values: z.infer<typeof patientSchema>) => {
    upsertPatientAction.execute({
      id: patient?.id,
      ...values,
    })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="flex items-center justify-center">
        <DialogTitle>
          {patient ? "Editar paciente" : "Adicionar paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite as informações do paciente"
            : "Adicione um novo paciente à sua clínica"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do paciente</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Digite o email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      if (value.length <= 11) {
                        field.onChange(value)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Selecione o sexo"
                        className="w-full"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sexo</SelectLabel>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertPatientAction.isExecuting}
              className="w-full"
            >
              {upsertPatientAction.isExecuting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {patient ? "Salvar alterações" : "Adicionar paciente"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

export default UpsertPatientForm
