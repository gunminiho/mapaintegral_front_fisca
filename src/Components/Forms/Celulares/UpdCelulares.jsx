import { Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CustomModal from '../../Modal/CustomModal';
import { useFormik } from 'formik';
import { TURNOS } from '../../helpers/Const';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../redux/slices/toastsSlice';
import axios from 'axios';
import header from '../../helpers/postHeaders';

const UpdCelulares = ({ data, set, FetchCelulares }) => {
    const [isOpen, setisOpen] = useState(false);
    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;
    const dispatch = useDispatch();

    const handleClose = () => {
        formik.resetForm(); // Reinicia el formulario
        setisOpen(false);   // Cierra el modal
        set(null)
    }

    const formik = useFormik({
        initialValues: {
            member: '',
            nombres: '',
            apellidos: '',
            telefono: '',
            dni: '',
            turno: '',
            superior: '',
        },
        validate: values => {
            const errors = {};
            if (!values.member) {
                errors.member = 'Requerido';
            }
            if (!values.nombres) {
                errors.nombres = 'Requerido';
            }
            if (!values.apellidos) {
                errors.apellidos = 'Requerido';
            }
            if (!values.telefono) {
                errors.telefono = 'Requerido';
            }
            if (!values.dni) {
                errors.dni = 'Requerido';
            }
            if (values.turno === null || values.turno === undefined || values.turno === '') {
                errors.turno = 'Requerido';
            }
            if (values.superior === null || values.superior === undefined || values.superior === '') {
                errors.superior = 'Requerido';
            }
            return errors;
        },
        onSubmit: (values) => {
            onUpdateCelular(values)
        }
    })

    const onUpdateCelular = (values) => {
        
        formik.setSubmitting(true);
        axios.put(`${endpoint}/usuarios/${values.member}`,values, header())
            .then((res) => {
                FetchCelulares()
                dispatch(showToast({ message: 'Se actualizo el celular', type: 'success', duration: 2000 }))
            })
            .catch((err) => {
                dispatch(showToast({ message: 'Ocurrio un error', type: 'error', duration: 2000 }))
                console.error(err)
            })
            .finally(() => {
                formik.setSubmitting(false);
            })
    }

    useEffect(() => {
        if (data) {
            setisOpen(true);
            formik.setFieldValue('member', data.member)
            formik.setFieldValue('nombres', data.nombres)
            formik.setFieldValue('apellidos', data.apellidos)
            formik.setFieldValue('telefono', data.telefono)
            formik.setFieldValue('dni', data.dni)
            formik.setFieldValue('turno', data.turno)
            formik.setFieldValue('superior', data.superior)
        }
    }, [data])

    return (
        <>
            <CustomModal Open={isOpen} setOpen={setisOpen} handleClose={handleClose}>
                <form onSubmit={formik.handleSubmit}>
                    <h1 className='text-lg font-bold'>Editar Celular</h1>
                    <div className='mt-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <TextField
                                size='small'
                                label="Nombres"
                                variant="standard"
                                type='text'
                                className='w-full'
                                id="nombres"
                                name='nombres'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombres}
                                error={formik.errors.nombres && formik.touched.nombres}
                                helperText={formik.errors.nombres && formik.touched.nombres ? formik.errors.nombres : 'Ingrese los nombres.'}
                                disabled
                            />
                            <TextField
                                size='small'
                                label="Apellidos"
                                variant="standard"
                                type='text'
                                className='w-full'
                                id="apellidos"
                                name='apellidos'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.apellidos}
                                error={formik.errors.apellidos && formik.touched.apellidos}
                                helperText={formik.errors.apellidos && formik.touched.apellidos ? formik.errors.apellidos : 'Ingrese los apellidos.'}
                                disabled
                            />
                            <TextField
                                size='small'
                                label="Telefono"
                                variant="standard"
                                type='text'
                                className='w-full'
                                id="telefono"
                                name='telefono'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.telefono}
                                error={formik.errors.telefono && formik.touched.telefono}
                                helperText={formik.errors.telefono && formik.touched.telefono ? formik.errors.telefono : 'Ingrese el telefono.'}
                                disabled
                            />
                            <TextField
                                size='small'
                                label="DNI"
                                variant="standard"
                                type='text'
                                className='w-full'
                                id="dni"
                                name='dni'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.dni}
                                error={formik.errors.dni && formik.touched.dni}
                                helperText={formik.errors.dni && formik.touched.dni ? formik.errors.dni : 'Ingrese el DNI.'}
                                disabled
                            />
                            <FormControl size='small' variant='standard' error={formik.errors.turno && formik.touched.turno}>
                                <InputLabel id="Truno-label">Turno</InputLabel>
                                <Select
                                    labelId="Truno-label"
                                    id="Turno"
                                    value={formik.values.turno}
                                    label="Trurno"
                                    name='turno'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    {TURNOS?.map((turno, index) => (
                                        <MenuItem key={index} value={turno.value}>{turno.label}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.errors.turno && formik.touched.turno ? formik.errors.turno : 'Seleccione el turno'}</FormHelperText>
                            </FormControl>
                            <TextField
                                size='small'
                                label="Superior"
                                variant="standard"
                                type='text'
                                className='w-full'
                                id="superior"
                                name='superior'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.superior}
                                error={formik.errors.superior && formik.touched.superior}
                                helperText={formik.errors.superior && formik.touched.superior ? formik.errors.superior : 'Ingrese el superior.'}
                            />
                        </div>
                        <div className='flex justify-between mt-4'>
                            <div></div>
                            <div className='flex gap-3'>
                                <Button type='button' variant="contained" color="inherit" onClick={handleClose}>Cancelar</Button>
                                <Button type='submit' variant="contained" color="success" disabled={formik.isSubmitting}>Guardar</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </CustomModal>
        </>
    )
}

export default UpdCelulares