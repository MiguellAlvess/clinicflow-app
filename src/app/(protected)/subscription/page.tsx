import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container"
import { auth } from "@/lib/auth"

import SubscriptionPlan from "./_components/subscription-plan"

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    redirect("/login")
  }
  if (!session.user.clinic) {
    redirect("/clinic-form")
  }
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencia a sua assinatura</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <SubscriptionPlan
          className="w-[280px]"
          active={
            session.user.plan === "premium" || session.user.plan === "essential"
          }
          userEmail={session.user.email}
        />
      </PageContent>
    </PageContainer>
  )
}

export default SubscriptionPage
