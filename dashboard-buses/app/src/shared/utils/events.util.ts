import { EventoEnum , EventoEnumDescripcion } from "../enums"

export function getEventoDescripcion(codigo: number): string {
    const key = EventoEnum[codigo] as keyof typeof EventoEnumDescripcion;

    if (!key) return "Evento desconocido";

    return EventoEnumDescripcion[key];
}