import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { socket } from '../Socket/socket';
import { Marker, Popup, useMap } from 'react-leaflet'
import celular from '../../assets/iconos/celular.png'
import shadow from '../../assets/iconos/marker-shadow.png'
import { CloseAllPopups, formatearFecha } from '../helpers/Functions';
import { useDispatch, useSelector } from 'react-redux';
import { setCelulares, setCelularesFiltered } from '../../redux/slices/CelularesSlice';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import CustomModal from '../Modal/CustomModal';
import { duration, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { showToast } from '../../redux/slices/toastsSlice';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useParams } from 'react-router-dom';
import UseCelulares from '../../Hooks/UseCelulares';


const Celulares = ({ itemsFiltros, setItemsFiltros }) => {
    const dispatch = useDispatch()
    const map = useMap();
    const clusterRef = useRef(null);
    const markersRef = useRef([]);
    const { celulares, celularFollowed, celularIsFollowed, celularesFiltered } = useSelector((state) => state.celulares);
    const [isOpenModal, setisOpenModal] = useState(false)
    const [SelectedMarkers, setSelectedMarkers] = useState([])
    const { id } = useParams();

    useEffect(() => {
        const arrFiltros = itemsFiltros.find(item => item.id === 'celulares')?.items || [];
    
        // Filtrar las celulares según los filtros
        const filtered = arrFiltros.every(filtro => filtro.checked) 
            ? celulares // Si todos los filtros están activados, mostrar todas las celulares
            : celulares.filter(celular => arrFiltros.every(({ checked, atributo, valorFiltro }) => {
                // Si el filtro está activado, permite que pase la celular                    
                if (checked) return true; 
    
                // Filtrar por atributo si el filtro está desactivado
                return !valorFiltro.map(v => v.toLowerCase()).includes(celular[atributo].toLowerCase());
            }));
    
        dispatch(setCelularesFiltered(filtered));
    }, [celulares, itemsFiltros]);

    useEffect(() => {
        const checkAndMoveToMarker = () => {
            if (celularIsFollowed || id) {
                const CeludarSeguido = celulares.find(cel => cel.id == celularFollowed || cel.id == id);
    
                if (CeludarSeguido) {   
                    // Encontrar el marcador existente
                    const marker = markersRef.current[CeludarSeguido.id];
    
                    if (marker) {
                        CloseAllPopups(map)
                        // Mover el mapa a la ubicación del marcador
                        map.flyTo([marker._latlng.lat, marker._latlng.lng], 18, {
                            animate: true,
                            duration: 0.1
                        });
                        setTimeout(() => {
                            // Verificar si el marcador está dentro de un clúster con la propiedad '_icon'
                            if (marker._icon === undefined || marker._icon === null) {
                                // Expande el clúster para mostrar los marcadores individuales
                                marker.__parent.spiderfy();
                            }
    
                            // Abrir el popup del marcador
                            marker.openPopup();
                        }, 600);
                    }
                }
            }
        };

        checkAndMoveToMarker();
    }, [celularIsFollowed, celularFollowed, celulares, map]);

    UseCelulares()

    const icon = L.icon({
        iconUrl: celular,
        iconSize: [30, 35],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
        shadowUrl: shadow,
        shadowSize: [60, 45],
        shadowAnchor: [15, 40],
    });

    const filterPhones = celularesFiltered || celulares

    return (
        <>
            <MarkerClusterGroup
                onClick={(e) => {
                    e.layer.unspiderfy();

                    const markers = e.layer.getAllChildMarkers();

                    if (markers.length > 0) {
                        const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
                        e.layer._map.fitBounds(bounds); // Asegúrate de tener una referencia al mapa

                        if (e.layer._zoom === 18) {
                            setisOpenModal(true);
                            setSelectedMarkers(markers);
                        }
                    }
                }}
                maxClusterRadius={30}
                zoomToBoundsOnClick={false}
                ref={clusterRef}
            >
                {filterPhones && filterPhones.map((punto, index) => {
                    const latitud = punto.position[0].latitude;
                    const longitud = punto.position[0].longitude;

                    const { id, nombres, apellidos, dni, telefono, turno, superior, date } = punto
                    const pos = [latitud, longitud];

                    return (
                        <Marker
                            key={id}
                            position={pos}
                            icon={icon}
                            attribution={punto}
                            ref={(ref) => markersRef.current[punto.id] = ref}
                        >
                            <Popup>
                                <span className="text-left max-w-xs">
                                    <p className="mt-2 text-sm text-gray-600"><strong>id:</strong> {id || 'No disponible'}</p>
                                    <p className="text-sm text-gray-600"><strong>Nombre:</strong> {nombres && apellidos ? `${nombres} ${apellidos}` : 'No disponible'}</p>
                                    <p className="text-sm text-gray-600"><strong>Teléfono:</strong> {telefono || 'No disponible'}</p>
                                    <p className="text-sm text-gray-600"><strong>DNI:</strong> {dni || 'No disponible'}</p>
                                    <p className="text-sm text-gray-600"><strong>Superior:</strong> {superior || 'No disponible'}</p>
                                    <p className="text-sm text-gray-600"><strong>Turno:</strong> {turno || 'No disponible'}</p>
                                    <p className="text-sm text-gray-600"><strong>Última actualización:</strong> {formatearFecha(date) || 'No disponible'}</p>
                                </span>
                            </Popup>
                        </Marker>
                    )
                })}
            </MarkerClusterGroup>

            {/* Modal info puntos */}

            <CustomModal
                Open={isOpenModal}
                handleClose={() => {
                    setisOpenModal(false)
                }}
            >
                <div className="flex items-center mb-2">
                    <h1 className='text-lg font-bold fl'>Lista de puntos</h1>
                </div>
                <div className='overflow-x-auto pb-2'>
                    <Table size='small' >
                        <TableHead className='bg-gray-200'>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }} className='sticky left-0 bg-gray-200 z-10'>Nombre</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Telefono</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>DNI</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Superior</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Turno</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {SelectedMarkers?.map((punto, index) => {
                                const latitud = punto.options.attribution.position[0].latitude;
                                const longitud = punto.options.attribution.position[0].longitude;

                                const { id, nombres, apellidos, dni, telefono, turno, superior, date } = punto.options.attribution
                                const pos = [latitud, longitud];

                                return (
                                    <TableRow key={index}>
                                        <TableCell className='text-nowrap sticky left-0 bg-white'>{nombres && apellidos ? `${nombres} ${apellidos}` : '-'}</TableCell>
                                        <TableCell className='text-nowrap'> {telefono || '-'}</TableCell>
                                        <TableCell className='text-nowrap'>{dni || '-'}</TableCell>
                                        <TableCell className='text-nowrap'>{superior || '-'}</TableCell>
                                        <TableCell className='text-nowrap'>{turno || '-'}</TableCell>
                                        <TableCell className='text-nowrap'>{formatearFecha(date) || '-'}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>


            </CustomModal>
        </>

    );
}

export default Celulares