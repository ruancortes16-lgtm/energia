# EnergIA

Projeto full stack para monitoramento inteligente de consumo de energia em pequenos negocios, com Next.js no frontend, FastAPI no backend e SQLite como banco local.

## Requisitos

- Python 3.11 ou superior instalado e disponível no PATH
- Node.js 20 ou superior
- npm

## Arquivos de ambiente

Backend:

```env
backend/.env
DATABASE_URL=sqlite:///./energia.db
```

Frontend:

```env
frontend/.env.local
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## Como rodar o backend

No PowerShell:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

O banco SQLite `backend/energia.db` sera criado automaticamente na primeira inicializacao, junto com dados iniciais de leitura.

## Como rodar o frontend

Em outro terminal PowerShell:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Se sua politica de execucao permitir scripts do PowerShell, tambem funciona com `npm install` e `npm run dev`.

## URLs para abrir no navegador

- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`
- Swagger da API: `http://127.0.0.1:8000/docs`

## Fluxo recomendado

1. Suba o backend.
2. Confirme no navegador `http://127.0.0.1:8000/docs`.
3. Suba o frontend.
4. Abra `http://localhost:3000`.

## Observacoes de validacao

- O frontend foi validado com `npm.cmd install`, checagem TypeScript e subida local na porta 3000.
- Neste ambiente de trabalho nao havia `python` instalado no PATH, entao a inicializacao real do FastAPI nao pôde ser executada aqui.
- A conexao frontend-backend esta configurada para `http://127.0.0.1:8000/api` e o CORS do backend aceita `http://localhost:3000` e `http://127.0.0.1:3000`.
