"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { createClinic } from "@/actions/create-clinic/create-clinic"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const clinicForm = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "O nome da clínica é obrigatório" }),
})

const ClinicForm = () => {
  const form = useForm<z.infer<typeof clinicForm>>({
    resolver: zodResolver(clinicForm),
    defaultValues: {
      name: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof clinicForm>) => {
    try {
      await createClinic(values.name)
    } catch (error) {
      if (isRedirectError(error)) {
        return
      }
      console.log(error)
      toast.error("Ocorreu um erro ao criar sua clínica")
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

export default ClinicForm
