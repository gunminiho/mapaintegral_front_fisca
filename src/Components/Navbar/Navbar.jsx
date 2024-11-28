import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { setGridState, setSelectGrids, clearListGrid } from "../../redux/slices/menuOptionsReducer";
import { setIsFollowed, setIssiFollowed } from "../../redux/slices/unitsReducer";
import Select from "react-select";
import Logo from "../../assets/logos/logo_sjl_2.png"
import Logo_xl from "../../assets/logos/logo_sjl.png"
import axios from "axios";
import AddPuntosTacticos from '../Forms/PuntosTacticos/AddPuntosTacticos';
import UpdPuntosTacticos from '../Forms/PuntosTacticos/UpdPuntosTacticos';
import AddRadios from '../Forms/Radios/AddRadios';
import UpdRadios from '../Forms/Radios/UpdRadios';
import { setRadios } from '../../redux/slices/RadiosReducers';
import { setPuntosTacticos, removePuntoTactico, addPuntosTacticos } from '../../redux/slices/AreasSlice';
import { Button } from '@mui/material';
import { setCelularFollowed, setIsFollowedCelular } from '../../redux/slices/CelularesSlice';


const Navbar = () => {
    const dispatch = useDispatch();
    const { gridState, selectGrids } = useSelector((state) => state.menuOptions);
    const { unidades, isFollowed, issiFollowed } = useSelector((state) => state.units);
    const { celulares, celularFollowed, celularIsFollowed } = useSelector((state) => state.celulares);
    const { puntosTacticos, selected } = useSelector(state => state.areas);
    const [isUpdate, setisUpdate] = useState(false)

    const ToggleUpdate = () => {
        setisUpdate(!isUpdate)
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open) => () => {
        setIsOpen(open);
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_ENDPOINT}/puntostacticos/`)
            .then((response) => {
                const data = response?.data
                dispatch(setPuntosTacticos(response?.data));
            })
            .catch(error => {
                console.error("Error cargando los puntos tacticos:", error);
            })

        axios.get(`${import.meta.env.VITE_APP_ENDPOINT}/radios`)
            .then(response => {
                dispatch(setRadios(response?.data));

            })
            .catch(error => {
                console.error('Error al Traer las radios', error);
            })
    }, [isUpdate]);

    useEffect(() => {
        
        const ArrDeleteObj = selected.filter(sel =>
            !puntosTacticos.some(pt => pt.id === sel.id)
          );
        
        if (ArrDeleteObj.length > 0) {
            // Eliminar los ibjetos ArrDeleteObj de el array selected
            ArrDeleteObj.forEach((item) => {
                dispatch(removePuntoTactico(item.id));
            });
        }
    }, [puntosTacticos])



    const toggleSelectGrids = (e) => {
        dispatch(setSelectGrids(!selectGrids));
        dispatch(clearListGrid());
    }
    const toggleGrid = (e) => {
        dispatch(setGridState(e.target.checked));
        if (selectGrids === true)
            dispatch(setSelectGrids(false));
    }

    const optionsUnidades = unidades.map((unit) => ({
        value: unit._issi,
        label: `${unit._issi} - ${unit._cargo ? unit._cargo : (unit._unidad ? unit._unidad : unit._tipounid)}`
    }));

    const optionsCelulares = celulares?.map((cel) => ({
        value: cel.id,
        label: `${cel.nombres} ${cel.apellidos} - ${cel.dni}`
    }));

    const pointsOptions = puntosTacticos?.map((punto) => ({
        value: punto.id,
        label: `${punto.nombre} - ${punto.ZonaAsociada.nombre}`
    }));

    const addZona = (selectedOption) => {
        if (!selectedOption) return;

        const ExistingOption = selected.find(s => s.id == selectedOption?.value)

        if (!ExistingOption) {
            dispatch(addPuntosTacticos(puntosTacticos.find(punto => punto.id == selectedOption.value)));
        }
    };

    const setSeguimiento = (e) => {
        dispatch(setIsFollowed(e.target.checked));

        // Desactivar otros seguimiento
        dispatch(setIsFollowedCelular(false));
    }
    const setSeguimientoCelular = (e) => {
        dispatch(setIsFollowedCelular(e.target.checked));

        // Desactivar otros seguimiento
        dispatch(setIsFollowed(false));
    }

    const setIssiNumber = (selectedOption) => {
        dispatch(setIssiFollowed(selectedOption ? selectedOption.value : null));
        dispatch(setIsFollowed(Boolean(selectedOption)));

        // Desactivar otros seguimiento
        Boolean(selectedOption) && dispatch(setIsFollowedCelular(false));
    }
    const setCelularNumber = (selectedOption) => {

        dispatch(setCelularFollowed(selectedOption ? selectedOption.value : null));
        dispatch(setIsFollowedCelular(Boolean(selectedOption)));

        // Desactivar otros seguimiento
        Boolean(selectedOption) && dispatch(setIsFollowed(false));
    }
    const removeZona = (id) => {
        dispatch(removePuntoTactico(id));
    }

    const customStylesOptions = {
        option: (provided) => ({
            ...provided,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }),
        singleValue: (provided) => ({
            ...provided,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }),
    };

    return (
        <div>
            {/* Botón para abrir el Drawer */}
            <Button
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                className="flex flex-col"
            >
                <img src={Logo} className="size-16" />
                <MenuIcon />
            </Button>

            {/* Drawer que contiene el Navbar */}
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={toggleDrawer(false)}
                className='Navbar'
            >
                <div className="flex flex-row items-center justify-center">
                    <img src={Logo_xl} className="w-[300px]" />
                </div>
                <div className="p-4 w-[fit-content]">
                    <table className="min-w-[420px] border border-gray-300 rounded-xl shadow-lg">
                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2 text-left font-semibold text-gray-700">
                                    <label htmlFor="seguimientoRadio" className="text-[15px] break-words">Seguimiento de Radio</label>
                                </td>
                                <td className="px-4 py-2 flex items-center w-[max-content]">
                                    <input type="checkbox" id="seguimientoRadio" onChange={setSeguimiento} checked={isFollowed} className="mr-2" />
                                    <Select
                                        options={optionsUnidades}
                                        value={optionsUnidades.find(option => option.value === issiFollowed)}
                                        onChange={setIssiNumber}
                                        placeholder="Selecciona una ISSI"
                                        isClearable
                                        classNamePrefix="react-select"
                                        className="min-w-[250px] max-w-[250px]"
                                    />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 text-left font-semibold text-gray-700">
                                    <label htmlFor="seguimientoCelular" className="text-[15px] break-words">Seguimiento de Celulares</label>
                                </td>
                                <td className="px-4 py-2 flex items-center w-[max-content]">
                                    <input type="checkbox" id="seguimientoCelular" onChange={setSeguimientoCelular} checked={celularIsFollowed} className="mr-2" />
                                    <Select
                                        options={optionsCelulares}
                                        value={optionsCelulares.find(option => option.value === celularFollowed)}
                                        onChange={setCelularNumber}
                                        placeholder="Selecciona una ISSI"
                                        isClearable
                                        classNamePrefix="react-select"
                                        className="min-w-[250px] max-w-[250px]"
                                        styles={customStylesOptions}
                                    />
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="px-4 py-2 text-left font-semibold text-gray-700">
                                    <label htmlFor="grid" className="text-[15px] break-words">Cuadriculas: </label>
                                </td>
                                <td className="px-4 py-2">
                                    <input type="checkbox" id="grid" onChange={toggleGrid} checked={gridState} />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-left font-semibold text-gray-700 text-[15px] break-words">Exportar cuadrantes</td>
                                <td className="px-4 py-2">
                                    <input type="checkbox" onChange={toggleSelectGrids} checked={selectGrids} disabled={!gridState} />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-left font-semibold text-gray-700 text-[15px] break-words min-h-[197px] align-bottom">
                                    <p>Adiminstrar Radios</p>
                                    <AddRadios dolphinRaidos={optionsUnidades} ToggleUpdate={ToggleUpdate} />
                                </td>
                                <td className='px-4 py-2 align-bottom'>
                                    <UpdRadios ToggleUpdate={ToggleUpdate} />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-left font-semibold text-gray-700 text-[15px] break-words min-h-[197px] align-bottom">
                                    <p>Puntos tacticos</p>
                                    <AddPuntosTacticos ToggleUpdate={ToggleUpdate} />
                                </td>
                                <td className='px-4 py-2 align-bottom'>
                                    <UpdPuntosTacticos ToggleUpdate={ToggleUpdate} />
                                </td>

                            </tr>
                            <tr className="hover:bg-gray-100">
                                <td className="px-4 py-2 text-left font-semibold text-gray-700 text-[15px] break-words min-h-[197px] align-top">
                                    <p>Seleccionar puntos tacticos</p>
                                    <Select
                                        options={pointsOptions}
                                        onChange={addZona}
                                        placeholder="Selecciona punto tactico"
                                        isClearable
                                        classNamePrefix="react-select"
                                        className="min-w-[250px] max-w-[250px] text-ellipsis "
                                        styles={{
                                            option: (provided, state) => ({
                                                ...provided,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            })
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-2 text-left font-semibold text-gray-700 text-[15px] break-words flex items-center justify-center min-h-[197px]">
                                    <div className="max-h-[150px] overflow-y-auto w-full">
                                        <ol>
                                            {selected?.map((punto, key) => {
                                                return (
                                                    <li key={key} className="hover:cursor-pointer hover:text-red-500 text-green-600" onClick={() => removeZona(punto.id)}>{punto?.nombre} - {punto?.ZonaAsociada.nombre}</li>
                                                )
                                            }
                                            )}
                                        </ol>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </Drawer>
        </div>
    );
}

export default Navbar;

/*  <td className="px-4 py-2 text-left font-semibold text-gray-700 text-[15px] break-words">Puntos Tacticos</td>  */
