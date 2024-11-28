import React, { memo, useEffect, useRef, useState } from "react";
import { FeatureGroup, LayersControl, Rectangle } from "react-leaflet";
import { useSelector } from "react-redux";
import AddIssiPunto from "../Forms/PuntosTacticos/AddIssiPunto";
import { getColorByIndex } from "../helpers/Functions";

const PuntosTacticos = memo(({ addLayer, removeAddedLayers, layers }) => {
    const layerTitle = 'Puntos de Vigilancia';
    const { selected, puntosTacticos } = useSelector(state => state.areas);
    const [showModal, setShowModal] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const BOUNDS_DISTANCE_METERS = 301; // Distancia en metros en cada lado
    const previousSelectedRef = useRef(selected);

    const handleCircleClick = (puntoIndex, featureIndex) => {
        setSelectedPoint({ puntoIndex, featureIndex });
        setShowModal(true);
    };

    function metersToDegrees(meters) {
        const earthRadius = 6371000; // Radio de la Tierra en metros
        const degrees = meters / (earthRadius * Math.PI / 180);
        return degrees;
    }
    const degreesOffset = metersToDegrees(BOUNDS_DISTANCE_METERS / 2);


    useEffect(() => {
        const removedItems = puntosTacticos.filter(
            (item) => !selected.some((selectedItem) => selectedItem.id === item.id)
        );


        // removeAddedLayers(layerTitle, 'tactico-');
        if (selected.length > 0) {
            removedItems.forEach((item) => {
                removeAddedLayers(layerTitle, `tactico-${item.id}`);
            })
            selected.forEach((item) => {
                addLayer({
                    id: `tactico-${item.id}`,
                    checked: false,
                    label: item.nombre
                }, layerTitle)
            })
        } else {
            removeAddedLayers(layerTitle, 'tactico-');
        }
    }, [selected]);

    return (
        <>
            {selected?.map((punto, puntoIndex) => {
                const group = layers.find(layer => layer.title === layerTitle);
                const verify = group?.layers.find(layer => layer.id === `tactico-${punto.id}`);

                if (!verify?.checked) return null;

                return (
                    <FeatureGroup key={`area-${puntoIndex}`}>
                        {punto.puntos.features.map((feature, featureIndex) => {
                            const [longitude, latitude] = feature.geometry.coordinates;

                            return (
                                <Rectangle
                                    key={`${punto.id}-${featureIndex}`}
                                    bounds={[
                                        [
                                            latitude - degreesOffset,
                                            longitude - degreesOffset
                                        ],
                                        [
                                            latitude + degreesOffset,
                                            longitude + degreesOffset
                                        ]
                                    ]}
                                    fillColor={getColorByIndex(punto.id)}
                                    color={getColorByIndex(punto.id)}
                                    weight={3}
                                    fillOpacity={0.3}
                                    eventHandlers={{
                                        click: () => handleCircleClick(puntoIndex, featureIndex),
                                    }}
                                />
                            );
                        })}
                    </FeatureGroup>
                );
            })}


            <AddIssiPunto
                showModal={showModal}
                setShowModal={setShowModal}
                selectedPoint={selectedPoint}
                selected={selected}
                tipoId={1}
                distancia={BOUNDS_DISTANCE_METERS}
            />
        </>
    );
});

export default PuntosTacticos;
