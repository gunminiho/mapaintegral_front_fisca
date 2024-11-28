import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import sostenimientoIcon from '../../assets/iconos/sostenimientoIcon.webp'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIssiSostenimineto from '../Forms/Sostenimiento/AddIssiSostenimineto';

const Sostenimiento = ({ id, updateLayerCount }) => {
    const [Puntos, setPuntos] = useState(null);
    const [OpenModal, setOpenModal] = useState(false)
    const [SelectedArea, setSelectedArea] = useState(null)
    const Radio = 150


    useEffect(() => {
        axios.get(`/maps/sostenimientos.geojson`)
            .then((res) => {
                setPuntos(res.data.features);
                updateLayerCount(id, res.data.features.length);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            updateLayerCount(id, 0);
        }
    }, []);

    return (
        <>
            {Puntos && Puntos.map((punto, key) => {
                const onClickCircle = (data) => {
                    setSelectedArea(data)
                    setOpenModal(true)

                };
                return (
                    <div key={key}>
                        <Marker
                            position={[punto.geometry.coordinates[1], punto.geometry.coordinates[0]]}
                            icon={L.icon({
                                iconUrl: sostenimientoIcon, // Cambia esta ruta al icono que desees usar
                                iconSize: [35, 35],
                                iconAnchor: [17.5, 17.5],
                                popupAnchor: [1, -35],
                            })}
                        >
                            <Popup>
                                <div className="text-left max-w-xs">
                                    <h3 className="text-lg text-center font-semibold text-gray-800">{punto.properties.name}</h3>
                                    <p className="mt-2 text-sm text-gray-600 flex gap-1">
                                        <strong>url: </strong>
                                        <a href={punto.properties.ubicacion} className='flex items-center gap-1' target="_blank" rel="noopener noreferrer">
                                            Ubicación <OpenInNewIcon style={{ width: 15, height: 15, }} />
                                        </a>
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        <strong>jurisdiccion:</strong> {punto.properties.jurisdiccion}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        <strong>Latitud:</strong> {punto.geometry.coordinates[0]}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        <strong>Longitud:</strong> {punto.geometry.coordinates[1]}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={[punto.geometry.coordinates[1], punto.geometry.coordinates[0]]}
                            radius={Radio}
                            color="red"
                            fillColor="red"
                            fillOpacity={0.2}
                            eventHandlers={{
                                click: () => {
                                    onClickCircle(punto);
                                }
                            }}
                        />
                    </div>
                )
            }
            )}
            <AddIssiSostenimineto
                showModal={OpenModal}
                setShowModal={setOpenModal}
                SelectedArea={SelectedArea}
                setSelectedArea={setSelectedArea}
                tipoId={0}
                valorId={0}
                distancia={Radio}
            />
        </>
    )
}

export default Sostenimiento