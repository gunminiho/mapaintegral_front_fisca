import React, { useEffect, useState } from 'react'
import CustomModal from '../../Modal/CustomModal'
import Binoculars from '../../../assets/iconos/Binoculars'
import { Autocomplete, Box, Button, duration, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import axios from 'axios'
import header from '../../helpers/postHeaders'
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import { showToast } from '../../../redux/slices/toastsSlice'

const AddIssiPunto = ({ showModal, setShowModal, selectedPoint, selected, tipoId, valorId, distancia }) => {

    const { celulares } = useSelector((state) => state.celulares);
    const { unidades } = useSelector((state) => state.units);
    const dispatch = useDispatch();
    const [ListIssis, setListIssis] = useState(null)
    const [isUpdate, setisUpdate] = useState(false)

    // o es para Circulo
    // 1 para cuadrado
    // 2 para poligonos

    const formik = useFormik({
        initialValues: {
            issi: "",
            latitud: "",
            longitud: "",
            punto_index: "",
            feature_index: "",
            options: {
                tipo: "",
                valor: "",
                distancia: "",
                nombre: ""
            }
        },
        validate: values => {
            const errors = {};
            if (!values.issi) {
                errors.issi = 'Requerido';
            }
            if (!values.latitud) {
                errors.latitud = 'Requerido';
            }
            if (!values.longitud) {
                errors.longitud = 'Requerido';
            }
            return errors;
        },
        onSubmit: (values) => {
            handleAdd(values)
        }
    })

    const handleAdd = (values) => {
        formik.setSubmitting(true);

        axios.post(`${import.meta.env.VITE_APP_ENDPOINT}/issis/add`, values, header())
            .then(res => {
                if (res.status === 201) {
                    dispatch(showToast({
                        message: "La radio se agregó correctamente.",
                        type: "success"
                    }))

                } else {
                    dispatch(showToast({
                        message: "La radio ya existía en esta u otra ubicación y se actualizó correctamente.",
                        type: "success"
                    }))
                }
                setisUpdate(!isUpdate)
            })
            .catch(error => {
                dispatch(showToast({
                    message: error.message,
                    type: "error"
                }))
                console.error(error)
            }).finally(() => {
                formik.setSubmitting(false);
                formik.setFieldValue('issi', '', false);
            })
    }

    const DeleteISSI_Punto = (issi) => {
        axios.delete(`${import.meta.env.VITE_APP_ENDPOINT}/issis/delete/${issi}`, {}, header())
            .then(res => {
                dispatch(showToast({
                    message: res.data.message,
                }))
                setisUpdate(!isUpdate)
            })
            .catch(error => {
                console.error(error)
                dispatch(showToast({
                    message: error.message,
                    type: "error"
                }))
            })
    }

    useEffect(() => {
        if (selectedPoint) {
            const { puntoIndex, featureIndex } = selectedPoint;
            const { coordinates } = selected[puntoIndex]?.puntos.features[featureIndex].geometry;
            const punto_index = selected[puntoIndex]?.id
            const [lat, lng] = coordinates;

            formik.setFieldValue('punto_index', punto_index);
            formik.setFieldValue('feature_index', featureIndex);
            formik.setFieldValue('latitud', lat);
            formik.setFieldValue('longitud', lng);
            formik.setFieldValue('options', {
                tipo: tipoId,
                valor: valorId,
                distancia: distancia,
                nombre: selected[puntoIndex]?.nombre
            });
        }

    }, [selectedPoint])

    useEffect(() => {
        if (selectedPoint && showModal) {
            const { puntoIndex, featureIndex } = selectedPoint;
            const { coordinates } = selected[puntoIndex]?.puntos.features[featureIndex].geometry;
            const punto_index = selected[puntoIndex]?.id
            const [lat, lng] = coordinates;

            const values = {
                latitud_api: lat,
                longitud_api: lng,
                feature_index_api: featureIndex,
                punto_index_api: punto_index,
                options_api: {}
            }

            axios.post(`${import.meta.env.VITE_APP_ENDPOINT}/issis/area`, values, header())
                .then(res => {
                    const { data } = res;
                    setListIssis(data.length ? [...data].reverse() : [])
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }, [showModal, isUpdate])



    const optionsISSI = [
        ...unidades.map((unit) => ({
            value: unit._issi,
            label: `${unit._issi} - ${unit._cargo ? unit._cargo : (unit._unidad ? unit._unidad : unit._tipounid)}`
        })),
        ...celulares?.map((cel) => ({
            value: cel.id,
            label: `${cel.nombres} ${cel.apellidos} - ${cel.dni} - ${cel.id}`
        }))
    ]

    const handleClose = () => {
        setShowModal(false);
        formik.resetForm();
    }

    return (
        <CustomModal Open={showModal} setOpen={setShowModal} handleClose={handleClose}>
            <div className="flex items-center mb-2">
                <Binoculars className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold fl'>Punto de Vigilancia</h1>
            </div>
            {selectedPoint && (
                <div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-gray-600 font-semibold text-sm">
                            {selected[selectedPoint.puntoIndex]?.nombre}
                        </p>
                        <p className="font-semibold text-gray-700 text-xs">
                            Latitud:
                            <span className="text-blue-600">
                                {selected[selectedPoint.puntoIndex]?.puntos.features[selectedPoint.featureIndex].geometry.coordinates[0]}
                            </span>
                        </p>
                        <p className="font-semibold text-gray-700 text-xs">
                            Longitud:
                            <span className="text-blue-600">
                                {selected[selectedPoint.puntoIndex]?.puntos.features[selectedPoint.featureIndex].geometry.coordinates[1]}
                            </span>
                        </p>
                    </div>
                </div>
            )}
            <div className='w-full pt-4'>
                <form onSubmit={formik.handleSubmit}>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div className='min-h-[150px]'>
                            <span className='font-semibold text-sm'>Lista de ISSIS:</span>
                            <div className='flex flex-wrap gap-3 '>
                                {ListIssis?.length > 0 ? <>
                                    {ListIssis.map((issi) => (
                                        <div
                                            onClick={() => DeleteISSI_Punto(issi)}
                                            className='flex items-center justify-between text-sm group cursor-pointer hover:bg-gray-100 rounded-full px-2'
                                            key={issi}
                                        >
                                            <div className=' flex items-center gap-1'>
                                                <CircleIcon style={{ width: '6px', height: '6px' }} />
                                                {issi}
                                            </div>
                                            <CloseIcon className='ml-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100' style={{ width: '16px', height: '15px', fill: 'rgb(107 114 128)' }} />

                                        </div>
                                    ))}
                                </>
                                    :
                                    <p className='text-sm flex items-center'>
                                        No hay ISSIS asignadas
                                    </p>

                                }
                            </div>
                        </div>
                        <div className='min-h-[150px] flex items-center w-full'>
                            <Autocomplete
                                className='w-full'
                                options={optionsISSI}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="ISSI o Celular"
                                        variant="standard"
                                        helperText={formik.errors.issi && formik.touched.issi ? formik.errors.issi : 'Seleccione una ISSI o celular para agregar.'}
                                        error={Boolean(formik.errors.issi && formik.touched.issi)}
                                        onBlur={formik.handleBlur}
                                    />
                                )}
                                id='issi'
                                name='issi'
                                value={optionsISSI.find(option => option.value === formik.values.issi) || null} // Evita undefined
                                onBlur={formik.handleBlur}
                                onChange={(event, newValue) => {
                                    formik.setFieldValue('issi', newValue?.value || '');
                                    return newValue;
                                }}

                            />
                        </div>
                    </div>
                    <div className='flex justify-between pt-5'>
                        <div></div>
                        <div className='flex gap-3'>
                            <Button type='button' variant="contained" color="inherit" onClick={handleClose}>Cerrar</Button>
                            <Button type='submit' variant="contained" color="success" disabled={formik.isSubmitting}>Agregar</Button>
                        </div>
                    </div>
                </form>
            </div>
        </CustomModal>
    )
}

export default AddIssiPunto