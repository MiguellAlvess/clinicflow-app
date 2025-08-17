import { Button } from "@/components/ui/button"

const Home = () => {
  return (
    <div className="flex">
      <div className="mb-4 text-4xl font-bold text-blue-600">ClinicFlow</div>
      <div className="mb-4 text-4xl font-bold">
        Bem-vindo ao sistema de gestão clínica
      </div>
      <Button>Entrar</Button>
    </div>
  )
}

export default Home
