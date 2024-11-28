import axios from "axios";
import { useState, useEffect } from "react";
import { Marker, Popup, LayerGroup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import AddIssiArea from "../Forms/Top150/AddIssiArea";
import * as turf from "@turf/turf";

const PuntosImportantes = ({ id, updateLayerCount }) => {
    const [puntosImportantes, setPuntosImportantes] = useState(null);
    const [OpenModal, setOpenModal] = useState(false)
    const [SelectedArea, setSelectedArea] = useState(null)

    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;

    const Radio = 150

    useEffect(() => {
        axios.get(`${endpoint}/puntostacticos/importantes`)
            .then((res) => {
                const data = res.data.data;
                updateLayerCount(id, res.data.data.length);

                const features = data.map((point, index) => {
                    return point.punto
                })
                setPuntosImportantes({
                    type: "FeatureCollection",
                    features
                });
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            updateLayerCount(id, 0);
        }
    }, []);

    const onClickCircle = (data) => {
        setSelectedArea(data)
        setOpenModal(true)

    };
    return (
        <>
            {puntosImportantes?.features?.map((punto, key) => (
                punto.geometry && punto.geometry.coordinates ? (
                    <Circle
                        key={key}
                        center={[punto.geometry.coordinates[1], punto.geometry.coordinates[0]]} // Latitud primero, luego longitud
                        radius={Radio}
                        eventHandlers={{
                            click: () => {
                                onClickCircle(punto);
                            },
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
                            {punto.properties.name}
                        </Tooltip>
                    </Circle>
                ) : null // Maneja el caso donde no haya geometry o coordinates
            ))}

            <AddIssiArea
                showModal={OpenModal}
                setShowModal={setOpenModal}
                SelectedArea={SelectedArea}
                setSelectedArea={setSelectedArea}
                tipoId={0}
                valorId={0}
                distancia={Radio}
            />
        </>
    );
};

export default PuntosImportantes;
