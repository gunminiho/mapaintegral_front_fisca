import React, { useEffect, useCallback, useRef, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import ListaPuntos from "../Popups/ListaPuntos";
import { deleteSelectedGrid, setSelectedGrids } from '../../redux/slices/menuOptionsReducer';
import { useDispatch, useSelector } from 'react-redux';
import Modal from "../Modal/Modal";

const GridMap = () => {
    const map = useMap();
    const dispatch = useDispatch();

    const { selectGrids, selectedGrids, gridState } = useSelector((state) => state.menuOptions);
    const selectGridsRef = useRef(selectGrids);
    const selectedGridsRef = useRef(selectedGrids);
    const [isOpen, setIsOpen] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        body: ""
    });

    useEffect(() => {
        selectGridsRef.current = selectGrids; // Actualiza la referencia cada vez que cambie `selectGrids`
        selectedGridsRef.current = selectedGrids;
    }, [selectGrids, selectedGrids]);

    //const bbox = [-77.0324, -12.0444, -76.9436, -11.9088]; // Crear un bounding box que cubra todo el distrito
    const bbox = [-77.03695379, -12.04468104, -76.94515379, -11.91238104]  // Crear un bounding box que cubra todo el distrito
    const grid = turf.squareGrid(bbox, 301, { units: 'meters' }); // Crear una cuadrícula de 0.5km x 0.5km dentro de este bounding box



    const closeModal = () => {
        setIsOpen(false);
    };

    const gridStyle = (feature) => {
        if (isSelected(feature)) {
            return {
                color: 'skyblue',
                weight: 1,
                fillOpacity: 0.5,
            };
        }
        return {
            color: 'black',
            weight: 1,
            fillOpacity: 0.1,
        };
    };

    const isSelected = (feature) => {
        const [centerLng, centerLat] = turf.centroid(feature).geometry.coordinates;
        return selectedGrids.some(
            (grid) => grid.latitud === centerLat && grid.longitud === centerLng
        );
    };

    const handleGridClick = useCallback((event, feature) => {
        if (!selectGridsRef.current) {
            return;
        }
        const [centerLng, centerLat] = turf.centroid(feature).geometry.coordinates;
        const exist = selectedGridsRef.current.some(
            (grid) => grid.latitud === centerLat && grid.longitud === centerLng
        );
        
        if (exist) {            
            dispatch(deleteSelectedGrid({ latitud: centerLat, longitud: centerLng }));
            return
        }

        dispatch(setSelectedGrids({ latitud: centerLat, longitud: centerLng }));
    }, [dispatch, setIsOpen, setModalText]);


    return (
        <>
            {gridState && (
                <>
                    <GeoJSON
                        data={grid}
                        style={gridStyle}
                        onEachFeature={(feature, layer) => {
                            layer.on('click', (event) => handleGridClick(event, feature));
                        }}
                    />
                    <ListaPuntos />
                    <Modal
                        isOpen={isOpen}
                        onClose={closeModal}
                        title={modalText.title}
                    >
                        {modalText.body}
                    </Modal>
                </>
            )}
        </>
    );

}

export default GridMap;
