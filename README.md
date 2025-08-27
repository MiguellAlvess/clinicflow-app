# ClinicFlow

Aplicação web full stack para gestão de clínicas e consultórios, permitindo o cadastro de médicos e pacientes, o agendamento e acompanhamento de consultas, o gerenciamento de pagamentos e informações financeiras, além de um dashboard para visualizar métricas e acompanhar o desempenho da clínica.

## Configuração do Ambiente

Para executar o projeto em seu ambiente de desenvolvimento, siga as instruções abaixo:

**Instale as dependências:**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

**Configure as variáveis de ambiente:**

- Crie um arquivo `.env` na raiz do projeto, com base no arquivo `.env.example`.
- Preencha as variáveis de ambiente com os valores corretos para o seu ambiente. Exemplo:

```
DATABASE_URL="<URL_DO_SEU_BANCO_DE_DADOS>"
BETTER_AUTH_SECRET="<UM_SEGREDO_ALEATORIO_E_SEGURO>"
BETTER_AUTH_URL="http://localhost:3000" # Ou o URL do seu ambiente
GOOGLE_CLIENT_ID="<ID_DO_CLIENTE_GOOGLE>"
GOOGLE_CLIENT_SECRET="<SEGREDO_DO_CLIENTE_GOOGLE>"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="<CHAVE_PUBLICA_DO_STRIPE>"
STRIPE_SECRET_KEY="<CHAVE_SECRETA_DO_STRIPE>"
STRIPE_PREMIUM_PLAN_PRICE_ID="<PRICE_ID_DO_PLANO_PREMIUM_NO_STRIPE>"
STRIPE_WEBHOOK_SECRET="<SEGREDO_DO_WEBHOOK_DO_STRIPE>"
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Ou o URL do seu ambiente
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL="<URL_DO_PORTAL_DO_CLIENTE_NO_STRIPE>"
STRIPE_PUBLIC_KEY="<CHAVE_PUBLICA_DO_STRIPE>"
```

**Execute as migrações do Drizzle :**

```bash
npx drizzle-kit push
```

**Inicie o ambiente de desenvolvimento:**

Sem docker

```bash
npm run dev
```

Com Docker:

```bash
docker-compose up -d

npm run dev
```

## Funcionalidades

- **Planos de assinatura**
- **Autenticação segura**
- **Agendamento de consultas:**
- **Gestão de pacientes**
- **Gestão de médicos**
- **Dashboard com métricas da clínica**

## Principais Tecnologias

- **Next.js:**
- **Tailwind CSS:**
- **TypeScript:**
- **Better Auth:**
- **Stripe:**
- **Docker:**
- **Drizzle ORM:**
- **PostgreSQL:**

## Autenticação

A autenticação é realizada através do Better Auth, que oferece uma experiência de login segura e personalizável. Os usuários podem se autenticar utilizando:

- **Email e senha:** método tradicional de autenticação, com validação de email e recuperação de senha.
- **Conta Google:** autenticação social através do Google, permitindo que os usuários acessem a plataforma com suas contas Google existentes.

## Stripe

Integração com Stripe para processamento de pagamentos de planos de assinatura.

## Deploy

Deploy realizado na Vercel.

## Visualização

Veja abaixo alguns prints das interfaces do projeto em funcionamento.
