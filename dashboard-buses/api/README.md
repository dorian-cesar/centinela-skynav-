# Servicio Fastify – LPF Centinela

Microservicio en **Node.js + Fastify + TypeScript** que reemplaza el flujo original en PHP (`conexion.php` y `lpf-centinela.php`).  
Su objetivo es consumir la API de **MasGPS**, normalizar la información de los trackers y enviarla al servicio externo **Centinela**, además de exponer endpoints para un dashboard de monitoreo de buses.

---

## 🧱 Arquitectura general

El proyecto sigue una estructura inspirada en **DDD + Hexagonal + SOLID**:

```txt
src/
├── server.ts                     # Servidor HTTP Fastify
├── worker/                       # Worker que ejecuta el loop de sincronización (opcional)
│   └── trackingLoop.ts
├── config/
│   └── env.ts                    # Carga y validación de variables de entorno
├── shared/
│   ├── errors/
│   │   └── AppError.ts           # Error base de aplicación
│   └── infra/
│       ├── db/
│       │   └── mysql.ts          # Pool de conexión MySQL
│       └── http/
│           └── httpClient.ts     # Cliente HTTP basado en fetch
└── modules/
    └── tracking/
        ├── domain/
        │   ├── models.ts         # Tipos de dominio (TrackerItem, TrackerGpsState, TrackerNormalizedPayload, etc.)
        │   └── ports.ts          # Interfaces de repositorios y clientes externos
        ├── application/
        │   ├── services/
        │   │   └── StateComparer.ts
        │   └── usecases/
        │       └── SyncTrackersUseCase.ts
        └── infra/
            ├── repositories/
            │   └── MysqlHashRepository.ts
            ├── clients/
            │   ├── MasgpsClient.ts
            │   └── CentinelaClient.ts
            └── http/
                └── tracking.controller.ts  # Rutas Fastify (/tracker_list, /show_tracker, /sync)
```

---

## 🔐 Variables de entorno

El proyecto usa `dotenv` y valida las variables con `zod` en `config/env.ts`.

Ejemplo de `.env` el cual debe ir en la raiz: api/.env:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=masgps

TRACKING_USER=usuario_masgps
TRACKING_PASSWORD=password_masgps

MASGPS_TRACKER_LIST_URL=https://example.masgps.com/tracker/list
MASGPS_TRACKER_LIST_SESSION_KEY=valor_session_key
MASGPS_TRACKER_LIST_ORIGIN=https://example.masgps.com
MASGPS_GET_STATE_URL=https://example.masgps.com/tracker/get_state

CENTINELA_TRANSMISION_URL=https://centinela.example.com/api/transmision
CENTINELA_TRANSMISION_BEARER=token_de_acceso
```

---

## 📦 Instalación

```bash
npm install
```

Instalar dependencias de desarrollo para TypeScript:

```bash
npm install --save-dev typescript ts-node-dev @types/node
```

Compilador TypeScript configurado en `tsconfig.json` (modo CommonJS) para que funcione bien con `ts-node-dev`.

---

## 🚀 Scripts

En `package.json` se contemplan scripts como:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "dev:worker": "ts-node-dev --respawn src/worker/trackingLoop.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "start:worker": "node dist/worker/trackingLoop.js"
  }
}
```

### Desarrollo

Servidor HTTP:

```bash
npm run dev
```

Worker de sincronización (loop tipo PHP con sleep/goto pero en Node):

```bash
npm run dev:worker
```

### Producción

```bash
npm run build
npm run start
npm run start:worker
```

---

## 🌐 Endpoints principales

### `GET /health`

Endpoint simple para validar que el servicio está vivo.

**Respuesta:**

```json
{
  "status": "ok"
}
```

---

### `GET /tracker_list`

Lista los trackers desde MasGPS.  
Internamente usa `MasgpsClient.listTrackers(hash)`.

- Obtiene el `hash` desde la base de datos (`MysqlHashRepository` tabla `masgps.hash`).
- Llama a la API de MasGPS con headers específicos (Origin, Referer, Cookie con `session_key`, User-Agent, etc.).
- Retorna un array de trackers normalizados.

**Ejemplo de respuesta normalizada:**

```json
[
  {
    "id": 10185765,
    "imei": "863284063498235",
    "label": "KCRW-47 / 3639"
  }
]
```

Cuando se usa el modo `allData` (opcional, según implementación), se puede enriquecer con el estado de cada tracker (`state`) respetando límites de la API (evitar 429).

---

### `GET /show_tracker/:id_tracker`

Obtiene el **estado actual** de un tracker específico.  
Usa:

- `MysqlHashRepository` → obtiene el `hash` a partir de `TRACKING_USER` y `TRACKING_PASSWORD`.
- `MasgpsClient.getTrackerState(hash, tracker)` → consulta la API `MASGPS_GET_STATE_URL`.

**Ejemplo de uso:**

```bash
curl http://127.0.0.1:3000/show_tracker/10111625
```

**Respuesta típica:**

```json
{
  "patente": "KCRW47",
  "latitud": -23.32907,
  "longitud": -69.8388816,
  "altitud": 1036,
  "velocidad": 45,
  "heading": 165,
  "evento": 41,
  "ignicion": 1,
  "fechaHora": "03/12/2025 10:50:04"
}
```

---

### `POST /sync`

Dispara el caso de uso `SyncTrackersUseCase` de forma manual:

1. Obtiene `hash` desde MySQL (`MysqlHashRepository`).
2. Llama `MasgpsClient.listTrackers(hash)`.
3. Por cada tracker, usa `MasgpsClient.getTrackerState(hash, tracker)`.
4. Normaliza los datos a un esquema similar al PHP original:
   - `patente`
   - `imei`
   - `latitud`
   - `longitud`
   - `altitud`
   - `velocidad`
   - `heading`
   - `fechaHora`
   - `ignicion`
   - `evento`
5. Realiza la comparación contra el estado previo (`PreviousStateRepository` + `StateComparer`).
6. Envía solo los cambios a Centinela (`CentinelaClient.sendPayload()`).
7. Actualiza el estado previo con los datos actuales.

**Respuesta:**

```json
{
  "total": 108,
  "enviados": 25
}
```

---

## 🔁 Lógica de comparación y estado previo

En el PHP original se usaba:

```php
$datosAnteriores = [];

Loop:
  $datosActuales = traer_datos();
  $payrol = comparar($datosAnteriores, $datosActuales);
  enviar_datos($payrol);
  $datosAnteriores = $datosActuales;
  sleep(30);
  goto Loop;
```

En Node.js se replica esta idea mediante:

- `PreviousStateRepository` (interfaz en `domain/ports.ts`).
- Implementación inicial en memoria (worker):
  - `getPreviousStates()` retorna el arreglo en memoria.
  - `saveCurrentStates()` lo reemplaza por el arreglo actual.
- `StateComparer.getUpdated(previous, current)`:
  - Compara elemento a elemento utilizando `fechaHora`.
  - Retorna solo los elementos actualizados.
  - Incluye una estrategia para detectar duplicados (`imei + fechaHora`) y loguear un warning.

La lógica de “bus dentro / fuera de línea” se basa en `connection_status` del estado de MasGPS:

- `active` / `idle` → ONLINE
- `offline` → OFFLINE

Esto se usa en el dashboard para marcar buses conectados o desconectados.

---

## 🧠 Reglas de negocio importantes

### Cálculo de evento

Basado en el código PHP original:

```php
if ($movement_status == 'moving' && $motor == '1') {
  $evento = 41;
} elseif ($movement_status == 'parked' && $motor == '0') {
  $evento = 42;
} elseif ($movement_status == 'parked' && $motor == '1') {
  $evento = 51;
} else {
  $evento = 52;
}
```

En TypeScript (`MasgpsClient.getTrackerState`):

```ts
let evento = 52;

if (res.state.movement_status === "moving" && ignicion === 1) {
  evento = 41;
} else if (res.state.movement_status === "parked" && ignicion === 0) {
  evento = 42;
} else if (res.state.movement_status === "parked" && ignicion === 1) {
  evento = 51;
} else {
  evento = 52;
}
```

### Formato de fecha

Equivalente a:

```php
$ultima_Conexion = date("d/m/Y H:i:s", strtotime($last_u));
```

En TypeScript se usa `dayjs`:

```ts
const fechaHora = dayjs(res.state.last_update).format("DD/MM/YYYY HH:mm:ss");
```

---

## 🧩 Modelos principales

### `TrackerGpsState`

Datos normalizados desde la API MasGPS para un tracker:

```ts
export interface TrackerGpsState {
  latitud: number;
  longitud: number;
  altitud: number;
  velocidad: number;
  heading: number;
  evento: number;
  ignicion: number;
  fechaHora: string;
}
```

### `TrackerNormalizedPayload`

Payload final enviado a Centinela:

```ts
export interface TrackerNormalizedPayload {
  patente: string;
  imei: string;
  fechaHora: string;
  latitud: number;
  longitud: number;
  altitud: number;
  velocidad: number;
  heading: number;
  ignicion: number;
  evento: number;
}
```

---

## 📡 Cliente MasGPS

Ubicado en `modules/tracking/infra/clients/MasgpsClient.ts`.

Responsable de:

- `listTrackers(hash, allData?)`
  - Llama a `MASGPS_TRACKER_LIST_URL` con headers específicos (incluido `session_key` en cookie).
  - Cuando `allData` es `true`, puede ejecutar llamadas adicionales a `allTrackerState` con pequeñas pausas para evitar HTTP 429.
- `getTrackerState(hash, tracker)`
  - Llama a `MASGPS_GET_STATE_URL` (POST) con `{ hash, tracker_id }`.
  - Mapea el JSON de respuesta al modelo `TrackerGpsState`.

---

## 🎯 Cliente Centinela

Ubicado en `modules/tracking/infra/clients/CentinelaClient.ts`.

- Hace `POST` a `CENTINELA_TRANSMISION_URL`.
- Usa header `Authorization: Bearer <CENTINELA_TRANSMISION_BEARER>`.
- Envía el array de `TrackerNormalizedPayload` generado por el caso de uso.

---

## ✅ CORS básico

En `server.ts` se puede habilitar CORS básico para permitir peticiones desde el dashboard (Next.js, React, etc.):

```ts
import fastifyCors from '@fastify/cors';

await fastify.register(fastifyCors, {
  origin: '*'
});
```

O restringido a dominios específicos:

```ts
await fastify.register(fastifyCors, {
  origin: ['http://localhost:3000', 'https://mi-dashboard.com']
});
```

---

## 📌 Notas finales

- El servicio reemplaza al flujo PHP original, pero con una arquitectura modular, tipada y extensible.
- Se mantiene la compatibilidad lógica con:
  - Cálculo de `evento`
  - Formato de `fechaHora`
  - Construcción de `patente` a partir de `label` (ej. `KCRW-47 / 3639` → `KCRW47`).
- La lógica de comparación y envío incremental permite evitar reenvíos innecesarios y preparar terreno para persistir estado en base de datos o Redis en futuras mejoras.
