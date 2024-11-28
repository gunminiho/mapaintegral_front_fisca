import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Circle, Marker, Popup } from 'react-leaflet'
import modulo1 from '../../assets/iconos/casetas.png'
import modulo2 from '../../assets/iconos/palacio.png'
import shadow from '../../assets/iconos/marker-shadow.png'
import AddIssiModulo from '../Forms/ModuloSerenos/AddIssiModulo'

const ModuloSerenos = ({ id, updateLayerCount }) => {
    const [ModuloSerenos, setModuloSerenos] = useState(null)
    const [OpenModal, setOpenModal] = useState(false)
    const [SelectedArea, setSelectedArea] = useState(null)
    const Radio = 100

    useEffect(() => {
        axios.get(`/maps/ModuloSerenos.json`).then(res => {
            setModuloSerenos(res.data.data)
            updateLayerCount(id, res.data.data.length);
        }).catch(err => {
            console.error(err)
        })

        return () => {
            updateLayerCount(id, 0);
        }
    }, [])


    return (
        <>
            {
                ModuloSerenos?.map(punto => {
                    const icon = L.icon({
                        iconUrl: punto.Tipo === "tipo1" ? modulo1 : modulo2,
                        iconSize: [35, 45],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30],
                        shadowUrl: shadow,
                        shadowSize: [50, 50],
                        shadowAnchor: [15, 40],
                    });

                    const onClickCircle = (data) => {
                        setSelectedArea(data)
                        setOpenModal(true)

                    };

                    return (
                        <div key={`${punto.Modulos}`}>
                            <Marker position={[punto.Latitud, punto.Longitud]} icon={icon}
                            >
                                <Popup>
                                    <div className="text-left max-w-xs">
                                        <h3 className="text-lg text-center font-semibold text-gray-800">{punto.Modulos}</h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            <strong>Nombre:</strong> {punto.Modulos}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            <strong>Tipo:</strong> {punto.Tipo}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            <strong>Latitud:</strong> {punto.Latitud.toFixed(8)}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            <strong>Longitud:</strong> {punto.Longitud.toFixed(8)}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                            <Circle
                                center={[punto.Latitud, punto.Longitud]}
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
                })
            }
            <AddIssiModulo
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

export default ModuloSerenos


