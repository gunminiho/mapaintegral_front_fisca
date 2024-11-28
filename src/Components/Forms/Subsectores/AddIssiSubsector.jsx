import React, { useEffect, useState } from 'react'
import CustomModal from '../../Modal/CustomModal';
import { useFormik } from 'formik';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import CircleIcon from '@mui/icons-material/Circle';
import { Autocomplete, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import header from '../../helpers/postHeaders';
import { showToast } from '../../../redux/slices/toastsSlice';

const AddIssiSubsector = ({ showModal, setShowModal, SelectedArea, setSelectedArea, tipoId }) => {
    const dispatch = useDispatch();
    const { unidades } = useSelector((state) => state.units);
    const { celulares } = useSelector((state) => state.celulares);
    const [ListIssis, setListIssis] = useState(null)
    const [isUpdate, setisUpdate] = useState(false)

    const handleClose = () => {
        setShowModal(false);
        formik.resetForm();
        setSelectedArea(null)
    }

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

    useEffect(() => {
        if (SelectedArea) {

            const id = SelectedArea.id
            formik.setFieldValue('options', {
                tipo: tipoId,
                valor: id,
                nombre: SelectedArea.properties.name
            });
        }
    }, [SelectedArea])

    useEffect(() => {
        if (SelectedArea && showModal) {
            const values = {
                latitud_api: "",
                longitud_api: "",
                options_api: {
                    tipo: tipoId,
                    valor: SelectedArea.id,
                }
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

    return (
        <CustomModal Open={showModal} setOpen={setShowModal} handleClose={handleClose}>
            <div className="flex items-center mb-2">

                <TravelExploreRoundedIcon className="w-6 h-6 mr-2" />
                <h1 className='text-lg font-bold fl'>Vigilancia de Subsector</h1>
            </div>

            {SelectedArea && (
                <div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="font-semibold text-gray-700 text-xs">
                            {SelectedArea.properties.name}
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

export default AddIssiSubsector