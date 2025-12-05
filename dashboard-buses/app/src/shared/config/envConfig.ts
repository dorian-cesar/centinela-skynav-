import { z } from "zod";

const schema = z.object({
    NEXT_PUBLIC_API_BASE_URL: z.url(),
    NEXT_PUBLIC_FRONTEND_URL: z.url(),
    NEXT_PUBLIC_API_TIMEOUT: z
        .string()
        .default("10000")
        .transform((v) => Number(v))
});

const rawEnv = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT ?? "10000",
}

const parsed = schema.safeParse(rawEnv);

if (!parsed.success) {
    console.error("❌ ERROR EN VARIABLES DE ENTORNO");

    const tree = z.treeifyError(parsed.error);
    console.error(tree);

    throw new Error("Environment validation failed");
}

export const env = {
    apiBaseUrl: parsed.data.NEXT_PUBLIC_API_BASE_URL,
    frontendUrl: parsed.data.NEXT_PUBLIC_FRONTEND_URL,
    apiTimeout: parsed.data.NEXT_PUBLIC_API_TIMEOUT,
};
