import { GeoJSON } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import { getColorByIndex } from "../helpers/Functions";
import AddIssiJurisdiccion from "../Forms/Jurisdiccion/AddIssiJurisdiccion";
import { setJurisdicciones } from "../../redux/slices/AreasSlice";
import { useDispatch, useSelector } from "react-redux";

const Jurisdicciones = () => {
    const dispatch = useDispatch();
    const { Jurisdicciones } = useSelector((state) => state.areas);
    const [OpenModal, setOpenModal] = useState(false)
    const [SelectedArea, setSelectedArea] = useState(null)

    useEffect(() => {
        const getJurisdicciones = async () => {
            try {
                const responses = await axios.get(`${import.meta.env.VITE_APP_ENDPOINT}/puntostacticos/sectores`);
                const combinedFeatures = responses.data.data.map((feature, index) => {
                    return {
                        id: feature.id,
                        name: feature.nombre,
                        ...feature.puntos,
                        customColor: getColorByIndex(index)
                    };
                })
                dispatch(setJurisdicciones({
                    type: "FeatureCollection",
                    features: combinedFeatures
                }))
            } catch (error) {
                console.error("Error cargando los GeoJSONs:", error.message);
            }
        };

        getJurisdicciones();
    }, []);

    const handleClickJurisdiccion = (feature) => {
        setSelectedArea(feature)
        setOpenModal(true)
    }

    return (
        <>
            {Jurisdicciones && (
                <GeoJSON
                    key={Jurisdicciones ? Jurisdicciones.features?.length : 0}
                    data={Jurisdicciones}
                    style={feature => ({
                        color: feature.customColor || 'black', // Usamos el color personalizado
                        weight: 2,
                    })}
                    eventHandlers={{
                        click: (event) => {
                            handleClickJurisdiccion(event.layer.feature);
                        }
                    }}
                />
            )}
            <AddIssiJurisdiccion
                showModal={OpenModal}
                setShowModal={setOpenModal}
                SelectedArea={SelectedArea}
                setSelectedArea={setSelectedArea}
                tipoId={3}
            />
        </>
    );
};

export default Jurisdicciones;
