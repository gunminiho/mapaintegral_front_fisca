import { GeoJSON, LayerGroup, LayersControl } from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import AddIssiSubsector from "../Forms/Subsectores/AddIssiSubsector";
import { useDispatch, useSelector } from "react-redux";
import { setSubsectores } from "../../redux/slices/AreasSlice";
import { getColorByIndex, validarNombres } from "../helpers/Functions";
const { Overlay } = LayersControl;

const Subsectores = ({ addLayer, layers }) => {
    const layerTitle = 'Subsectores';
    const dispatch = useDispatch();
    const { Jurisdicciones } = useSelector((state) => state.areas);
    const [combinedData, setCombinedData] = useState(null);
    const [OpenModal, setOpenModal] = useState(false)
    const [SelectedArea, setSelectedArea] = useState(null)
    // const [SECTORES, setSECTORES] = useState({})


    const handleClickSubsector = (feature) => {
        setSelectedArea(feature)
        setOpenModal(true)
    }

    //    CODIGOS DE SECTORES
    const SECTORES = Jurisdicciones ? Jurisdicciones.features?.reduce((acc, { id, name }) => {
        acc[id] = name
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
        return acc;
    }, {}) : {};



    useEffect(() => {
        if (Jurisdicciones && Jurisdicciones.features?.length > 0) {
            axios.get(`${import.meta.env.VITE_APP_ENDPOINT}/puntostacticos/subsectores`)
                .then(response => {
                    const data = response.data.data;
                        
                    const featuresBySector = data.reduce((acc, { sector, puntos, id }) => {
                        // Normaliza o valida el nombre del sector
                        if (!acc[sector]) {
                            acc[sector] = {
                                type: "FeatureCollection",
                                features: [],
                                properties: {
                                    name: `Sector ${SECTORES[sector]}`,
                                },
                            };
                        }
                    
                        const validacion = validarNombres(SECTORES[sector], puntos.properties.name);
                    
                        if (validacion) {
                            // Si la validación es verdadera, agregamos el punto con el color personalizado
                            acc[sector].features.push({
                                ...puntos,
                                customColor: getColorByIndex(sector),
                                id,
                            });
                        } else {
                            // Si la validación es falsa, buscamos el sector que coincida
                            const matchingSector = Object.keys(SECTORES).find((key) =>
                                validarNombres(SECTORES[key], puntos.properties.name)
                            );
                    
                            if (matchingSector) {
                                // Asegúrate de que el sector coincidente esté inicializado
                                if (!acc[matchingSector]) {
                                    acc[matchingSector] = {
                                        type: "FeatureCollection",
                                        features: [],
                                        properties: {
                                            name: `Sector ${SECTORES[matchingSector]}`,
                                        },
                                    };
                                }
                                // Si encontramos un sector coincidente, agregamos el punto allí
                                acc[matchingSector].features.push({
                                    ...puntos,
                                    customColor: getColorByIndex(matchingSector),
                                    id,
                                });
                            }
                        }
                    
                        return acc;
                    }, []);
                    
                    
                    
                    

                    const filteredFeaturesBySector = featuresBySector.filter(Boolean);
                    console.log(filteredFeaturesBySector);

                    setCombinedData({
                        type: "FeatureCollection",
                        features: filteredFeaturesBySector
                    })

                    dispatch(setSubsectores(data))

                })
                .catch(error => {
                    console.error(error.message);
                })


            // Definir el orden deseado
            const ordenSectores = [
                "Zarate",
                "Caja De Agua",
                "La Huayrona",
                "Canto Rey",
                "Santa Elizabeth",
                "Bayovar",
                "10 De Octubre",
                "Mariscal Caceres"
            ];

            const sectoresOrdenados = ordenSectores.map(nombre => {
                // Encuentra la clave del sector que tiene el mismo nombre
                const key = Object.keys(SECTORES).find(key => SECTORES[key] === nombre);
                return {
                    key,
                    label: SECTORES[key]
                };
            });

            // Renderizar según el orden
            sectoresOrdenados.forEach(({ key, label }) => {
                addLayer({
                    id: `subsector-${key}`,
                    checked: false,
                    label: label
                }, layerTitle);
            });


        }
    }, [Jurisdicciones])

    return (
        <>
            {combinedData?.features.length > 0 && (
                combinedData.features.map((feature, index) => {

                    const group = layers.find(layer => layer.title === layerTitle);
                    const verify = group?.layers.find(layer => layer.id === `subsector-${index + 1}`);

                    if (!verify?.checked) return null;

                    return (
                        <GeoJSON
                            key={index + 1}
                            data={feature}
                            style={feature => ({
                                color: feature.customColor || 'black', // Usamos el color personalizado
                                weight: 2,
                                opacity: 1,
                                interactive: true,
                            })}
                            onEachFeature={(event, layer) => {
                                layer.addEventListener('click', (e) => {
                                    handleClickSubsector(e.target.feature);
                                })

                                layer.bindTooltip(event.properties.name, {
                                    direction: 'center',
                                    className: 'bg-white/70 text-black rounded-md px-2 py-1 text-[.7rem]',
                                    offset: [0, 0],
                                });

                            }}
                        />
                    )
                })
            )}
            <AddIssiSubsector
                showModal={OpenModal}
                setShowModal={setOpenModal}
                SelectedArea={SelectedArea}
                setSelectedArea={setSelectedArea}
                tipoId={2}
            />
        </>
    );
};



export default Subsectores;