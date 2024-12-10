import axios from "axios";
import { useEffect, useState, useRef } from 'react';
import getIcon from "../helpers/getUnidadIcon";
import { Marker, Popup, useMap } from 'react-leaflet';
import { LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet'; // Importa Leaflet si no está importado
import header from "../helpers/postHeaders";
import { useSelector, useDispatch } from "react-redux";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { socket } from "../Socket/socket";
import CustomModal from "../Modal/CustomModal";
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { CloseAllPopups } from "../helpers/Functions";
import { setIsFollowed, setIssiFollowed, setResumen, setUnidadesFiltered, setUnits } from "../../redux/slices/unitsReducer";
import { handleCloseToast, showToast } from "../../redux/slices/toastsSlice";

const { Overlay } = LayersControl;

const Unidades = ({ itemsFiltros, setItemsFiltros }) => {
    const [tipoUnidades, setTipoUnidades] = useState(null);
    const { unidades, issiFollowed, isFollowed, unidadesFiltered } = useSelector((state) => state.units);
    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;
    const dispatch = useDispatch();
    const map = useMap();
    const markersRef = useRef({});
    const clusterRef = useRef(null);
    const [isOpenModal, setisOpenModal] = useState(false)
    const [SelectedMarkers, setSelectedMarkers] = useState([])
    const { toasts, isListening } = useSelector((state) => state.toasts);
    const toastsRef = useRef(toasts);

    useEffect(() => {
        const arrFiltros = itemsFiltros.find(item => item.id === 'unidades')?.items || [];
    
        // Filtrar las unidades según los filtros
        const filtered = arrFiltros.every(filtro => filtro.checked) 
            ? unidades // Si todos los filtros están activados, mostrar todas las unidades
            : unidades.filter(unidad => arrFiltros.every(({ checked, atributo, valorFiltro }) => {
                // Si el filtro está activado, permite que pase la unidad                    
                if (checked) return true; 
    
                // Filtrar por atributo si el filtro está desactivado
                return atributo === "_idtunidad"
                    ? !valorFiltro.includes(tipoUnidades[unidad?._tipounid])
                    : !valorFiltro.includes(unidad[atributo]);
            }));
    
        dispatch(setUnidadesFiltered(filtered));
    }, [unidades, itemsFiltros]);


    const debounceTimerRef = useRef(null);
    useEffect(() => {
        if (isFollowed) {
            const unidadSeguida = unidades.find(unit => unit._issi === issiFollowed);
            if (unidadSeguida) {
                // Encontrar el marcador existente y abrir su popup
                const marker = markersRef.current[unidadSeguida._issi];
                if (marker) {
                    CloseAllPopups(map);
                    map.flyTo([unidadSeguida._longitud, unidadSeguida._latitud], 18, {
                        animate: true,
                        duration: 0.1
                    });

                    // Limpiar el debounce anterior si existe
                    if (debounceTimerRef.current) {
                        clearTimeout(debounceTimerRef.current);
                    }

                    // Establecer un nuevo debounce
                    debounceTimerRef.current = setTimeout(() => {
                        // Verificar si el marcador está dentro de un clúster con la propiedad '_icon'
                        if (!marker._icon) {
                            if (marker.__parent && typeof marker.__parent.spiderfy === 'function') {
                                marker.__parent.spiderfy();
                            }
                        }

                        marker.openPopup();
                    }, 600); // El tiempo de debounce puede ajustarse según lo necesites
                }
            }
        }
    }, [isFollowed, issiFollowed, unidades, map]);


    useEffect(() => {
        fetchUnits();
        fetchTipoUnidades();
        socket.on('unidades', (data) => {
            dispatch(setUnits(data || []));
        })
        socket.on('conteo', (data) => {
            dispatch(setResumen(data || []));
        })
        return () => {
            socket.off('unidades');
            socket.off('conteo');
        }
    }, [])

    const fetchUnits = () => {
        const payload = {
            type: "0",
            state: 'TODOS',
            orden: "1",
            issi: ""
        };
        axios.post(`${endpoint}/api/realtime`, payload, header())
            .then(response => {
                dispatch(setUnits(response.data.result));
                dispatch(setResumen(response.data.conteo));
            })
            .catch(error => {
                console.error("Error cargando las unidades:", error);
            });
    }

    const fetchTipoUnidades = () => {
        axios.get(`${endpoint}/api/tiposunidades`)
            .then((response) => {
                setTipoUnidades(response?.data);

            })
            .catch(error => {
                console.error("Error cargando los tipos de unidades:", error);
            });
    }

    const filterUnits = unidadesFiltered || unidades

    const onFollowPoint = (id) => {
        dispatch(setIssiFollowed(id));
        dispatch(setIsFollowed(true));
        setTimeout(() => {
            dispatch(setIsFollowed(false));
        }, 5000);
    }
    useEffect(() => {
        toastsRef.current = toasts
    }, [toasts])
    const speedViolationCounts = useRef({});
    
    useEffect(() => {
        if (Array.isArray(filterUnits) && isListening) {
            filterUnits.forEach((unit) => {
                const toastArr = toastsRef.current;
                const existingToast = toastArr.find((toast) => toast.id === unit._issi);
                if (
                    unit._estado === 'NORMAL' &&
                    unit._velocidad > 30 &&
                    unit._velocidad < 150 &&
                    unit._placa
                ) {
                    // Incrementar el contador de violaciones
                    speedViolationCounts.current[unit._issi] = (speedViolationCounts.current[unit._issi] || 0) + 1;
                    if (speedViolationCounts.current[unit._issi] > 3 && !existingToast) {
                        dispatch(showToast({
                            id: unit._issi,
                            message: `La unidad ${unit._issi} sobrepasó le limite (${parseFloat(unit._velocidad).toFixed(2)} km/h)`,
                            type: 'info',
                            duration: null,
                            vertical: 'top',
                            horizontal: 'right',
                            title: 'Límite de velocidad',
                            onClick: () => onFollowPoint(unit._issi),
                            cluster: 'velocidad',
                        }));
                    }
                } else {
                    // Reiniciar el contador si no cumple las condiciones
                    if (speedViolationCounts.current[unit._issi]) {
                        delete speedViolationCounts.current[unit._issi];
                    }
                    if (existingToast) {
                        dispatch(handleCloseToast(unit._issi));
                    }
                }
            });
        }
    }, [filterUnits]);

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
                {filterUnits && tipoUnidades && filterUnits?.map((unidad) => {
                    const { iconUrl, size } = getIcon(tipoUnidades[unidad?._tipounid]);
                    const shadowColor = unidad._hexacolor || '#000000';

                    const direction = unidad._direccion || '';
                    const angle = parseFloat(direction.split(' ')[1]) - 45 || 0;
                    const tipo = tipoUnidades[unidad?._tipounid]

                    const icon = L.divIcon({
                        className: 'custom-marker',
                        html: `
                                    <div style="
                                        width: ${size[0]}px;
                                        height: ${size[1]}px;
                                        position: relative;
                                    ">
                                    <!-- Flecha -->
                                        ${unidad?._velocidad > 1 && unidad?._estado == 'NORMAL' ?
                                `
                                                <div class="shadow-lg bg-slate-400">
                                                    <div style="
                                                    position: absolute;
                                                    top: ${size[1] / 2 - (tipo == 1 || tipo == 2 ? 17 : 23)}px;
                                                    left: 50%;
                                                    transform: translateX(-50%) translateY(-50%) rotate(${angle}deg); /* Rotar y mover al borde del círculo */
                                                    width: 15px;
                                                    height: 15px;
                                                    ">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#1e3050" viewBox="0 0 448 512"><path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8l176 0 0 176c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"/></svg>
                                                    </div>
                                                </div>
                                             `:
                                `<div></div>`
                            }
                                        <img src="${iconUrl}" alt="icon" style="width: 100%; height: 100%;" />
                                        <div style="
                                            content: '';
                                            position: absolute;
                                            width: 50%;
                                            height: 50%;
                                            background-color: ${shadowColor};
                                            border-radius: 50%;
                                            filter: blur(10px);
                                            z-index: -1;
                                            top: 10px;
                                            left: 10px;
                                        "></div>

                                        
                                    </div>
                                `,
                        iconSize: size,
                        iconAnchor: [size[0] / 2, size[1]],
                        popupAnchor: [0, -size[1]]
                    });
                    const pos = [unidad._longitud, unidad._latitud]; // Corregir el orden de latitud y longitud

                    return (
                        <Marker
                            key={unidad._issi}
                            position={pos}
                            icon={icon}
                            attribution={unidad}
                            ref={(ref) => markersRef.current[unidad._issi] = ref}
                        >
                            <Popup>
                                <span>
                                    <p>ISSI: {unidad._issi}</p>
                                    <p>{unidad._unidad ? `Unidad: ${unidad._unidad}` : ""}</p>
                                    <p>{unidad._placa ? `Placa: ${unidad._placa}` : ""}</p>
                                    <p>{unidad._cargo ? `Cargo: ${unidad._cargo}` : ""}</p>
                                    <p>{unidad._nombre ? `Nombre: ${unidad._nombre}` : ""}</p>
                                    <p>Estado: {unidad._estado}</p>
                                    <p>Fecha : {unidad._fechahora}</p>
                                    <p>Velocidad: {unidad._velocidad}</p>
                                </span>
                            </Popup>
                        </Marker>
                    );
                })}
            </MarkerClusterGroup>

            <CustomModal
                Open={isOpenModal}
                handleClose={() => {
                    setisOpenModal(false)
                }}
            >
                <div className="flex items-center mb-2">
                    <h1 className='text-lg font-bold fl'>Lista de puntos</h1>
                </div>
                <div className='overflow-x-auto pb-2 overflow-y-auto max-h-[500px]'>
                    <Table stickyHeader size='small' aria-label="sticky table">
                        <TableHead className='bg-gray-200'>
                            <TableRow>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }} className='sticky left-0 z-10'>Issi</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Tipo</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Nombre</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Cargo</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Placa</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Unidad</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Velocidad</TableCell>
                                <TableCell style={{ backgroundColor: '#e5e7eb' }}>Dirección</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {SelectedMarkers?.map((punto) => {

                                const { _issi, _tipounid, _nombre, _cargo, _placa, _unidad, _hexacolor, _velocidad, _direccion } = punto.options.attribution

                                return (
                                    <TableRow key={_issi}>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap sticky left-0 bg-white'>{`${_issi}` || '-'}</TableCell>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap'> {getIcon(tipoUnidades[_tipounid]).label || '-'}</TableCell>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap'> {_nombre || '-'}</TableCell>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap'>{_cargo || '-'}</TableCell>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap'>{_placa || '-'}</TableCell>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap'>{_unidad || '-'}</TableCell>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap'>{_velocidad || '-'}</TableCell>
                                        <TableCell style={{ color: _hexacolor }} className='text-nowrap'>{_direccion || '-'}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>

                <div className='flex justify-between items-center mt-5'>
                    <div className="flex gap-3 text-wrap items-center">
                        <div className="flex gap-2 items-center">
                            <div className="bg-[#ed0202] size-3 border shadow-sm">
                            </div>
                            <span className="text-xs">No Reporta</span>
                        </div>
                        |
                        <div className="flex gap-2 items-center">
                            <div className="bg-[#f0e807] size-3 border shadow-sm">
                            </div>
                            <span className="text-xs">Sin señal GPS</span>
                        </div>
                        |
                        <div className="flex gap-2 items-center">
                            <div className="bg-[#04d62e] size-3 border shadow-sm">
                            </div>
                            <span className="text-xs">Transmitiendo</span>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <Button type='button' size="small" variant="contained" color="inherit" onClick={() => setisOpenModal(false)}>Cerrar</Button>
                    </div>
                </div>
            </CustomModal>
        </>
    );
};

export default Unidades;
