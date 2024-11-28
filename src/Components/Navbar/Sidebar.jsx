//import "./Navbar.css";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGridState, setSelectGrids, clearListGrid } from "../../redux/slices/menuOptionsReducer";
import { setIsFollowed, setIssiFollowed } from "../../redux/slices/unitsReducer";
import Select from "react-select";

const Navbar = () => {

    const dispatch = useDispatch();
    const { gridState, selectGrids } = useSelector((state) => state.menuOptions);
    const { unidades, isFollowed } = useSelector((state) => state.units);

    const toggleSelectGrids = (e) => {
        dispatch(setSelectGrids(!selectGrids));
        dispatch(clearListGrid());
    }
    const toggleGrid = (e) => {
        dispatch(setGridState(e.target.checked));
        if (selectGrids === true)
            dispatch(setSelectGrids(false));
    }

    const options = unidades.map((unit) => ({
        value: unit._issi,
        label: `${unit._issi} - ${unit._cargo ? unit._cargo : (unit._unidad ? unit._unidad : unit._tipounid)}`
    }));

    const setSeguimiento = (e) => {
        dispatch(setIsFollowed(e.target.checked));
    }
    const setIssiNumber = (selectedOption) => {
        dispatch(setIssiFollowed(selectedOption ? selectedOption.value : null));
        dispatch(setIsFollowed(true));
    }

    return (
        <nav id="nav" className="flex flex-column p-2">
            <table className="min-w-[420px] border border-gray-300 rounded-xl shadow-lg">
                <tbody>
                    <tr className="border-b">
                        <td className="px-4 py-2 text-left font-semibold text-gray-700">
                            <label htmlFor="seguimiento" className="text-[15px] break-words">Seguimiento de Radio</label>
                        </td>
                        <td className="px-4 py-2 flex items-center w-[max-content]">
                            <input type="checkbox" id="seguimiento" onClick={setSeguimiento} checked={isFollowed} className="mr-2" />
                            <Select
                                options={options}
                                onChange={setIssiNumber}
                                placeholder="Selecciona una ISSI"
                                isClearable
                                classNamePrefix="react-select"
                                className="min-w-[220px]"
                            />
                        </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-100">
                        <td className="px-4 py-2 text-left font-semibold text-gray-700">
                            <label htmlFor="grid" className="text-[15px] break-words" >Cuadriculas: </label>
                        </td>
                        <td className="px-4 py-2">
                            <input type="checkbox" id="grid" onChange={toggleGrid} />
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-left font-semibold text-gray-700 text-[15px] break-words ">Exportar cuadrantes</td>
                        <td className="px-4 py-2"><input type="checkbox" onChange={toggleSelectGrids} checked={selectGrids} disabled={!gridState} ></input></td>
                    </tr>
                </tbody>
            </table>
        </nav>
    );
}

export default Navbar;


/* 
<input type="checkbox" id="odintrack" onClick={checkOdin} className="mr-2" />
 <input type="text" placeholder="ISSI" onChange={setOdinIssi} value={odin} className="w-[100px] border border-gray-300 rounded-lg p-1" />

/*useEffect(() => {

        axios.get('/maps/cecom.geojson')
            .then(response => {
                setCecom(response.data);
            })
            .catch(error => {
                console.error("Error cargando el GeoJSON de cecom:", error);
            });
    }, []);
   
    
     const [cecom, setCecom] = useState(null);
    const [odin, setOdin] = useState(22605);
    const [active, setActive] = useState(false);
    const [isOut, setIsOut] = useState(false);

    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}/realtime`;
    
    import * as turf from '@turf/turf';
    import axios from "axios";

    */