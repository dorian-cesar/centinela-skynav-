# Monitoreo de Buses -- Dashboard (Next.js + TS + Axios + Tailwind)

This is a **Next.js** project bootstrapped with\
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

El sistema implementa:

-   Dashboard de monitoreo de buses\
-   Consumo de API mediante Axios\
-   Modal de detalle con datos reales\
-   Configuración sólida de variables de entorno\
-   Validación tipada usando Zod\
-   Uso de `loadEnvConfig` para carga de `.env.local`

------------------------------------------------------------------------

## 🚀 Getting Started

### 1. 📦 Instalación

``` bash
npm install
```

------------------------------------------------------------------------

## 2. 🔧 Configure environment variables

Create a file named:

    .env.local

Add:

``` env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3000

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5000

# HTTP client timeout
NEXT_PUBLIC_API_TIMEOUT=120000
```

These variables are validated and typed through:

    src/config/envConfig.ts

------------------------------------------------------------------------

## 🌐 3. Running the development server

Linux Mint does **NOT** automatically apply the `PORT` variable from
`.env.local`.

To start the dev server on custom port:

``` bash
PORT=5000 npm run dev
```

Open:

👉 http://localhost:5000

------------------------------------------------------------------------

## 🖥️ 4. Project scripts

Run dev server:

``` bash
PORT=5000 npm run dev
```

Build:

``` bash
npm run build
```

Start production server:

``` bash
npm start
```

------------------------------------------------------------------------

## 📁 5. Project Structure

    src/
      app/
        page.tsx               -> Main dashboard
      shared/
        components/            -> Reusable UI components
        mocks/                 -> Mock data (optional)
        types/                 -> App types
      services/
        http/httpClient.ts     -> Axios instance
        trackers/              -> Tracker service + mapper
      config/
        envConfig.ts           -> Env loader + validation

------------------------------------------------------------------------

## 🌱 6. Environment Configuration (envConfig.ts)

The environment loader validates:

``` ts
const schema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  NEXT_PUBLIC_FRONTEND_URL: z.url(),
  NEXT_PUBLIC_API_TIMEOUT: z
    .string()
    .transform(Number)
    .default("10000"),
});
```

If something is missing:

``` ts
const tree = z.treeifyError(parsed.error);
console.error(tree);
throw new Error("Environment validation failed");
```

------------------------------------------------------------------------

## 🔗 7. HTTP Client (Axios)

``` ts
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
});
```

------------------------------------------------------------------------

## 📡 8. Services

-   `/tracker_list` → Loads all trackers
-   `/show_tracker/:id` → Loads tracker details

Mapped by:

    src/services/trackers/mapper.ts

------------------------------------------------------------------------

# 🎉 Done!

Your Next.js dashboard is now fully configured with:

✔ Dynamic environment variables\
✔ Typed and validated configuration\
✔ Correct Linux Mint port setup\
✔ Axios integration\
✔ Clean folder structure
