export interface TrackerHash {
  hash: string;
}

export interface TrackerItem {
  id: string;
  imei?: string;
  label: string;
}

export interface TrackerGpsState {
  alt: number;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  signal_level: number;
  movement_status: 'moving' | 'parked' | string;
  ignition: boolean;
  last_update: string;
}

export interface TrackerNormalizedPayload {
  patente: string;
  imei: string | undefined;
  fechaHora: string;
  latitud: number;
  longitud: number;
  altitud: number;
  velocidad: number;
  heading: number;
  ignicion: number;
  evento: number;
}
