# SmartGrow AI — site 100% funcional (Pix + login + dashboard)

Este projeto é um SaaS simples:
- Landing, cadastro e login
- Planos (diário/semanal/mensal/anual)
- Pagamento via Pix (chave e "copia e cola")
- Upload do comprovante Pix
- PF (pessoa física) só entra com comprovação aprovada
- Dashboard liberado apenas com assinatura ACTIVE

## Rodar local
1) `cp .env.example .env` e preencha
2) Banco Postgres na `DATABASE_URL`
3) `npm install`
4) `npx prisma migrate dev --name init`
5) `npm run dev`

## Supabase
- Crie um bucket privado `uploads` (ou mude `SUPABASE_BUCKET`)
- Use SERVICE_ROLE_KEY no backend

## Como fica "100% certo" com Pix
Sem gateway, o fluxo é:
1) Usuário gera Pix e paga no banco
2) Usuário envia comprovante (upload)
3) Admin aprova o pagamento => subscription vira ACTIVE e libera o dashboard

## Produção
Para publicar online, use Vercel (Next.js). Coloque as variáveis do `.env` lá.

Obs.: A chave Pix está no `.env` (PIX_KEY). Você pediu Pix via chave: pedro.henrique.andre22@gmail.com
