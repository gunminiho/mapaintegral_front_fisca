import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import comisaria from '../../assets/iconos/comisaria.png'
import shadow from '../../assets/iconos/marker-shadow.png'

const Comisarias = ({ id, updateLayerCount }) => {
    const [Comisarias, setComisarias] = useState(null)

    useEffect(() => {
        axios.get(`/maps/Comisarias.json`).then(res => {
            setComisarias(res.data.data)
            updateLayerCount(id, res.data.data.length);
            
        }).catch(err => {
            console.error(err)
        })

        return () => {
            updateLayerCount(id, 0);
        }
    }, [])

    return (
        Comisarias?.map(punto => {
            const icon = L.icon({
                iconUrl: comisaria,
                iconSize: [30, 40], 
                iconAnchor: [15, 30], 
                popupAnchor: [0, -30], 
                shadowUrl: shadow, 
                shadowSize: [60, 53], 
                shadowAnchor: [15, 40], 
            });


            return (
                <Marker key={`${punto.Latitud}-${punto.Longitud}`} position={[punto.Latitud, punto.Longitud]} icon={icon}
                >
                    <Popup>
                        <div className="text-left max-w-xs">
                            <h3 className="text-lg text-center font-semibold text-gray-800">{punto.Nombre}</h3>

                            <p className="mt-1 text-sm text-gray-600">
                                <strong>Latitud:</strong> {punto.Latitud.toFixed(8)}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                                <strong>Longitud:</strong> {punto.Longitud.toFixed(8)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )
        })
    )
}

export default Comisarias