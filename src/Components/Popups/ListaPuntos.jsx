import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectGrids, clearListGrid } from "../../redux/slices/menuOptionsReducer";
import * as XLSX from "xlsx";
import Excel from "../../assets/iconos/excel.svg";
import Close from "../../assets/iconos/close.svg";
import Delete from "../../assets/iconos/delete.svg";
import DeleteAll from "../../assets/iconos/delete_all.svg";
import Save from "../../assets/iconos/save.svg";
import Modal from "../Modal/Modal";
import { showToast } from '../../redux/slices/toastsSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import * as turf from '@turf/turf';

const ListaPuntos = () => {
    const dispatch = useDispatch();


    const { selectGrids, selectedGrids } = useSelector((state) => state.menuOptions);
    const [isOpen, setIsOpen] = useState(false);
    const [modalText, setModalText] = useState({
        title: "",
        body: ""
    });


    const closeModal = () => {
        setIsOpen(false);
    };

    const togglePopup = () => {
        if (selectGrids && selectedGrids.length > 0) {
            const close = window.confirm("Estas seguro que deseas salir? se perderan los puntos que has seleccionado");
            if (close) {
                dispatch(setSelectGrids(!selectGrids));
                dispatch(clearListGrid());
            }
            else
                return false;
        }
        dispatch(setSelectGrids(!selectGrids));
    };

    const exportGeoJson = () => {
        try {
            if (selectedGrids.length === 0) {
                throw new Error('No hay puntos seleccionados para exportar.');
            }

            const pointCollection = selectedGrids.map((point) => {
                return turf.point([point.longitud, point.latitud]);
            })
            const FeatureCollection = turf.featureCollection(pointCollection);

            const geoJsonString = JSON.stringify(FeatureCollection);

            // Crea un blob y un enlace para descargar el archivo
            const blob = new Blob([geoJsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exported-data.geojson';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            dispatch(showToast({ type: 'error', message: error.message }));
            console.error('Error al exportar GeoJSON:', error.message);
            // Aquí podrías mostrar una notificación o alerta al usuario si lo deseas
        }
    };


    const clearList = () => {
        dispatch(clearListGrid());
    };


    const CopyPuntoToClipboard = (e) => {
        //Copiar un punto al clipboard
        const str = JSON.stringify(e)

        navigator.clipboard.writeText(str).then(() => {
            dispatch(showToast({
                message: "¡Punto copiado al portapapeles!",
                type: "success",
                duration: 1000
            }));
        }).catch(err => {
            dispatch(showToast({
                message: "Error al copiar el punto!",
                type: "success"
            }));
        });
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                title={modalText.title}
            >
                {modalText.body}
            </Modal>
            {selectGrids && (
                <div className="absolute top-2 right-2 bg-white p-4 shadow-lg rounded-lg z-[1000]">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Puntos seleccionados</h2>
                        <img src={Close} className="size-6 border hover:bg-red-500 hover:cursor-pointer" onClick={togglePopup} />
                    </div>
                    <div className="max-h-[350px] overflow-y-auto w-[415px] min-h-[300px]">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg ">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="py-2 px-4 text-left font-semibold">Punto</th>
                                    <th className="py-2 px-4 text-left font-semibold">Latitud</th>
                                    <th className="py-2 px-4 text-left font-semibold">Longitud</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedGrids.map((grid, key) => {
                                    return (
                                        <tr key={key} className="border-t hover:bg-gray-50" onClick={() => CopyPuntoToClipboard(grid)}>
                                            <td className="py-2 px-4 text-gray-700">{key + 1}</td>
                                            <td className="py-2 px-4 text-gray-700">{grid.latitud}</td>
                                            <td className="py-2 px-4 text-gray-700">{grid.longitud}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="mt-4 border border-blue-500 bg-gray-200 p-2 rounded-lg w-1/2 flex items-center justify-center hover:bg-gray-300"
                            onClick={exportGeoJson}
                        >
                            <SaveIcon
                                style={{
                                    fill: "#525252",
                                    fontSize: "2rem",
                                }}
                            />
                        </button>
                        <button
                            type="button"
                            className="mt-4 border border-blue-500 bg-gray-200 p-2 rounded-lg w-1/2 flex items-center justify-center hover:bg-gray-300"
                            onClick={clearList}
                        >
                            <DeleteIcon
                                style={{
                                    fill: "#525252",
                                    fontSize: "2rem",
                                }}
                            />
                        </button>
                    </div>
                </div>

            )}
        </>
    );
};

export default ListaPuntos;
