// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// const registerSchema = z.object({
//   name: z.string().trim().min(1, {
//     message: "O nome é obrigatório",
//   }),
//   email: z
//     .string()
//     .trim()
//     .min(1, {
//       message: "O email é obrigatório",
//     })
//     .email({
//       message: "O email é inválido",
//     }),
//   password: z.string().trim().min(8, {
//     message: "A senha precisa ter pelo menos 8 caracteres",
//   }),
// })

const AutheticationPage = () => {
  // const form = useForm<z.infer<typeof registerSchema>>({
  //   resolver: zodResolver(registerSchema),
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     password: "",
  //   },
  // })

  // function onSubmit(values: z.infer<typeof registerSchema>) {
  //   console.log(values)
  // }
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Fazer login</CardTitle>
              <CardDescription>Faça login para continuar</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Entrar</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Criar conta</CardTitle>
              <CardDescription>Cria uma conta para continuar</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Criar conta</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AutheticationPage
