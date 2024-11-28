import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
//import incidenciasData from '../../assets/incidencias/incidencias.json';

const HeatmapLayer = () => {
    const map = useMap();
    const [heatData, setHeatData] = useState([]);

    useEffect(() => {
        // Procesar las incidencias para obtener un array de coordenadas
        const incidencias = incidenciasData.map(incidencia => [
            incidencia.Latitud,
            incidencia.Longitud,
            0.5 // Este valor representa la intensidad del punto (puede ser ajustado)
        ]);

        setHeatData(incidencias);

        // Crear la capa de mapa de calor
        const heat = L.heatLayer(heatData, {
            radius: 20, // radio del calor
            blur: 15,   // desenfoque
            maxZoom: 17,
        }).addTo(map);

        // Limpiar la capa de calor al desmontar el componente
        return () => {
            map.removeLayer(heat);
        };
    }, [heatData]);

    return null;
};

const Heatmap = () => {
    
    return (
        
            <HeatmapLayer />
        
    );
};

export default Heatmap;
