"use client";

import { MapContainer, TileLayer  , Marker, Popup  } from "react-leaflet";
import L, { DivIcon } from "leaflet";
import type { LatLngExpression } from "leaflet";
import { renderToString } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

type MapViewProps = {
    center: LatLngExpression;
    zoom?: number;
    height?: number | string;
};

const busIcon: DivIcon = L.divIcon({
    html: renderToString(<FaBus size={20} />),
    className: "custom-bus-icon leaflet-div-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

export function MapView({
    center,
    zoom = 13,
    height = 400,
}: MapViewProps) {
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const mapHeight = typeof height === "number" ? `${height}px` : height || "400px";

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom
            style={{ height: mapHeight, width: "100%" }}
        >
            <TileLayer
                url={tileUrl}
                attribution='&copy; OpenStreetMap contributors'
                maxZoom={19}
            />

            <Marker position={center} icon={busIcon}>
                <Popup>
                <strong>Bus / tracker aquí</strong>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
