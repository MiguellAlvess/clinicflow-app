import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

import SubscriptionPlan from "../(protected)/subscription/_components/subscription-plan"

const NewSubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/authentication")
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="mb-8 w-full max-w-3xl text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Eleve o padrão da sua clínica
        </h1>
        <p className="mb-1 text-xl text-gray-600">
          Escolha seu plano e potencialize a gestão da sua clínica
        </p>
      </div>

      <div className="w-full max-w-md">
        <SubscriptionPlan userEmail={session.user.email} />
      </div>

      <div className="mt-8 max-w-lg text-center">
        <p className="text-sm text-gray-500">
          Otimize a gestão da sua clínica com uma solução completa e segura.
        </p>
      </div>
    </div>
  )
}

export default NewSubscriptionPage
