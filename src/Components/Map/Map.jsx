import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import Cuadricula from "../Graphics/Cuadriculas";
import Jurisdicciones from '../Graphics/Jurisdicciones';
import Heatmap from '../Heatmap/Heatmap';
import Municipales from "../Graphics/Municipales";
import Vecinales from "../Graphics/Vecinales";
import Unidades from '../Tracking/Unidades';
import 'leaflet/dist/leaflet.css';
import Conteo from '../Popups/Conteo';
import Puntos from "../Graphics/PuntosTacticos";
import TransporteIncidencias from '../Graphics/TransporteIncidencias';
import PuntosImportantes from '../Graphics/PuntosImportantes';
import AlertsManager from '../Socket/Listeners/AlertsManager';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, IconButton, Popover } from '@mui/material';
import { useState } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import Subsectores from "../Graphics/Subsectores";
import ModuloSerenos from "../Graphics/ModuloSerenos";
import Comisarias from "../Graphics/Comisarias";
import Transporte from "../Graphics/Transporte";
import PuntosBasura from "../Graphics/PuntosBasura";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Celulares from "../Tracking/NewCelulares";
import Sostenimiento from "../Graphics/Sostenimiento";
import PuestosSeguridad from "../Graphics/PuestosSeguridad";
import FiltersPopover from "../Popups/FiltersPopover";
import Conteo_2 from '../Popups/ConteoCelular';

const Map = () => {
    const position = [-11.977148, -76.996402]; // Coordenadas para SJL ,Lima, Perú
    const BtnRef = useRef(null);

    const [itemsFiltros, setItemsFiltros] = useState([
        {
            id: "unidades",
            items: [
                {
                    label: "Activos",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_color",
                    valorFiltro: ["verde", "amarillo", "naranja"]
                },
                {
                    label: "Inactivos",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_color",
                    valorFiltro: ["rojo"]
                },
                {
                    label: "Moto Meta",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [0]
                },
                {
                    label: "Movil Meta",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [1]
                },
                {
                    label: "Movil Libre",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [2]
                },
                {
                    label: "Moto Libre",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [3]
                },
                {
                    label: "Ambulancia",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [5]
                },
                {
                    label: "Subgerente",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [6]
                },
                {
                    label: "Sereno a Pie",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [7]
                },
                {
                    label: "Supervisor",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "_idtunidad",
                    valorFiltro: [8]
                },
            ]
        },
        {
            id: "celulares",
            items: [
                {
                    label: "Activo",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "estado",
                    valorFiltro: ["Activo"]
                },
                {
                    label: "Inactivo",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "estado",
                    valorFiltro: ["Inactivo"]
                },
                {
                    label: "Turno Mañana",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "turno",
                    valorFiltro: ["Mañana"]
                },
                {
                    label: "Turno Tarde",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "turno",
                    valorFiltro: ["Tarde"]
                },
                {
                    label: "Turno Noche",
                    onClick: (id, label) => { handleCheckboxChange(id, label) },
                    checked: true,
                    atributo: "turno",
                    valorFiltro: ["Noche"]
                },
            ]
        }
    ]);

    const [OpenMenu, setOpenMenu] = useState(false)
    const [layers, setLayers] = useState([
        {
            title: 'Servicios',
            layers: [
                { id: 'municipales', checked: false, label: 'C. Municipales', layer: Municipales, count: 0 },
                { id: 'vecinales', checked: false, label: 'C. Vecinales', layer: Vecinales, count: 0 },
                // { id: 'transporteIncidencias', label: 'Transporte Incidencias', layer: TransporteIncidencias },
                { id: 'ubicacionComisarias', checked: false, label: 'Ubicación de Comisarías', layer: Comisarias, count: 0 },
                { id: 'paraderosTransporte', checked: false, label: 'Paraderos de Transporte', layer: Transporte, count: 0 },
                { id: 'puntosBasura', checked: false, label: 'Puntos de Basura', layer: PuntosBasura, count: 0 },
                { id: 'sostenimien', checked: false, label: 'Sostenimiento', layer: Sostenimiento, count: 0 },
                { id: 'puestosSeguridad', checked: false, label: 'Puestos de Seguridad', layer: PuestosSeguridad, count: 0 },
            ]
        },
        {
            title: 'Puntos de Interés',
            layers: [
                { id: 'jurisdicciones', checked: true, label: 'Jurisdicciones', layer: Jurisdicciones },
                { id: 'unidades', checked: true, label: 'Unidades', layer: Unidades },
                { id: 'celulares', checked: true, label: 'Celulares', layer: Celulares },
            ]
        },
        {
            title: 'Subsectores',
            layers: []
        },
        {
            title: 'Puntos de Vigilancia',
            layers: [
                { id: 'puntosImportantes', checked: false, label: 'Puntos Importantes', layer: PuntosImportantes, count: 0 },
                { id: 'moduloSerenos', checked: false, label: 'Módulo de Serenos', layer: ModuloSerenos, count: 0 },
            ]
        }
    ]);

    const handleCheckboxChange = (groupId, label) => {
        setItemsFiltros((prevItemsFiltros) =>
            prevItemsFiltros.map((group) => {
                // Verificar si el grupo coincide
                if (group.id === groupId) {
                    return {
                        ...group,
                        items: group.items.map((item) => {
                            // Cambiar el estado del checkbox si el label coincide
                            if (item.label === label) {
                                return { ...item, checked: !item.checked };
                            }
                            return item;
                        }),
                    };
                }
                return group;
            })
        );
    };

    const addLayer = (newLayer, title) => {
        setLayers((prevLayers) => {
            return prevLayers.map(section => {
                // Si el título coincide, verificar si el layer ya existe
                if (section.title === title) {
                    const layerExists = section.layers.some(layer => layer.id === newLayer.id);

                    // Si no existe, agregar el nuevo layer
                    if (!layerExists) {
                        return {
                            ...section,
                            layers: [...section.layers, newLayer]
                        };
                    }
                }
                return section; // Mantener las otras secciones sin cambios
            });
        });
    };

    const removeAddedLayers = (title, prefix) => {
        setLayers((prevLayers) => {
            return prevLayers.map((section) => {
                if (section.title === title) {
                    return {
                        ...section,
                        layers: section.layers.filter((layer) => !layer.id.startsWith(prefix))
                    };
                }
                return section; // Mantener las otras secciones sin cambios
            });
        });
    };


    const handleOpenMenu = (event) => {
        setOpenMenu(true);
    };

    const handleCloseMenu = () => {
        setOpenMenu(null);
    };


    const open = Boolean(OpenMenu);

    const toggleChecked = useCallback((id) => {
        setLayers((prevLayers) => {
            const updatedLayers = [...prevLayers];
            for (let category of updatedLayers) {
                const layer = category.layers.find((layer) => layer.id === id);
                if (layer) {
                    layer.checked = !layer.checked;
                    break;
                }
            }
            return updatedLayers;
        });
    }, []);

    const isUnidadesChecked = useMemo(() => {
        return layers.some((group) =>
            group.layers.some((layer) => layer.id === 'unidades' && layer.checked)
        );
    }, [layers]);
    const isCelularesChecked = useMemo(() => {
        return layers.some((group) =>
            group.layers.some((layer) => layer.id === 'celulares' && layer.checked)
        );
    }, [layers]);



    const updateLayerCount = useCallback((id, count) => {
        setLayers((prevLayers) =>
            prevLayers.map((section) => ({
                ...section,
                layers: section.layers.map((layer) =>
                    layer.id === id ? { ...layer, count } : layer
                ),
            }))
        );
    }, []);

    const renderLayers = useMemo(() => (
        layers.map((layer) =>
            layer.layers.map((item) => {
                return (
                    item.checked && item.layer ?
                        item.id == "unidades" || "celulares" ? // Agregar a esta condición las capas en las que se aplicaran filtros
                            <item.layer key={item.id} id={item.id} updateLayerCount={updateLayerCount} itemsFiltros={itemsFiltros} setItemsFiltros={setItemsFiltros} /> :
                            <item.layer key={item.id} id={item.id} updateLayerCount={updateLayerCount} /> :
                        null
                )
            })
        )
    ), [layers, itemsFiltros]);


    const LayerItem = memo(({ item, toggleChecked }) => {
        return (
            <div className="text-xs">
                <Checkbox
                    onChange={() => toggleChecked(item.id)}
                    checked={item.checked}
                    id={item.id}
                    style={{ padding: '0 5px 0 0' }}
                    size='small'
                />
                <label htmlFor={item.id}>{item.label} {item.count > 0 ? `(${item.count})` : ''}</label>
            </div>
        );
    });

    // Componente memoizado para los grupos de capas
    const LayerGroup = memo(({ layer, toggleChecked }) => {
        const isExpanded = layer.layers.some(item => item.checked);

        return (
            <Accordion
                className='Group'
                variant="standard"
                disableGutters
                defaultExpanded={isExpanded}
                sx={{ padding: 0, '&:before': { display: 'none' } }} // Elimina las líneas de separación predeterminadas y reduce padding
            >
                <AccordionSummary
                    className='font-semibold'
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />}
                    sx={{
                        minHeight: '25px',
                        '&.MuiAccordionSummary-root': { padding: '0 8px' },
                        '& .MuiAccordionSummary-content': { margin: 0 },
                        fontSize: '13px'
                    }}
                >
                    {layer.title} {`(${layer.layers.length})`}
                </AccordionSummary>
                <AccordionDetails
                    className='layerGroup'
                    sx={{ padding: '4px 12px' }} // Detalles con menos padding
                >
                    {layer.layers.map((item) => (
                        <LayerItem key={item.id} item={item} toggleChecked={toggleChecked} />
                    ))}
                </AccordionDetails>
            </Accordion>
        )
    });



    const LayerMenu = ({ layers, toggleChecked }) => {
        return (
            <div id="Layers" className='w-full h-full p-2 px-3 text-sm flex flex-col gap-2 select-none' onMouseEnter={handleOpenMenu} onMouseLeave={handleCloseMenu}>
                {layers.map((layer) => (
                    <LayerGroup key={layer.title} layer={layer} toggleChecked={toggleChecked} />
                ))}
            </div>
        );
    };

    return (
        <>
            <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }} >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <Button
                    aria-describedby="Layers"
                    onMouseEnter={handleOpenMenu}
                    onMouseLeave={handleCloseMenu}
                    onClick={handleOpenMenu}
                    className='top-20 shadow-lg'
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        position: 'absolute',
                        minWidth: '30px',
                        left: '8px',
                        border: '2px solid rgba(0, 0, 0, 0.3)',
                        zIndex: 1100,
                    }}
                    ref={BtnRef}
                >
                    <LayersIcon style={{
                        height: '20px',
                        width: '20px',
                    }} />
                </Button>
                <Popover
                    id={"Layers"}
                    open={open}
                    anchorEl={BtnRef.current}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    aria-hidden={!open}
                    style={{ zIndex: 1000 }}
                >
                    <LayerMenu layers={layers} toggleChecked={toggleChecked} />
                </Popover>

                <FiltersPopover layers={layers} itemsFiltros={itemsFiltros} setItemsFiltros={setItemsFiltros} />

                {renderLayers}

                <Subsectores addLayer={addLayer} layers={layers} />
                <Puntos addLayer={addLayer} removeAddedLayers={removeAddedLayers} layers={layers} />
                <Cuadricula />
                {isUnidadesChecked && <Conteo />}
                {isCelularesChecked && <Conteo_2 />}
                < AlertsManager />
            </MapContainer >

            {/* Botones para el manejo de las Alertas. */}
        </>
    );

};

export default Map;