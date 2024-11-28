import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { Autocomplete, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import CustomModal from '../../Modal/CustomModal';
import { TIPO_UNIDAD } from '../../helpers/Const';
import axios from 'axios';
import DeleteRadios from './DeleteRadios';
import header from '../../helpers/postHeaders';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../../redux/slices/toastsSlice';

const UpdRadios = ({ ToggleUpdate }) => {
    const dispatch = useDispatch();
    const [isOpen, setisOpen] = useState(false);
    const { radios } = useSelector((state) => state.radios);

    const handleClose = () => {
        setisOpen(false);   // Cierra el modal
        formik.resetForm(); // Reinicia el formulario
    };


    const formik = useFormik({
        initialValues: {
            issi: "",
            fuente: "",
            tipo: "",
            cargo: "",
            nombre: "",
            placa: "",
            unidad: "",
        },
        validate: values => {
            const errors = {};
            if (!values.issi) {
                errors.issi = 'Requerido';
            } else if (!/^[0-9]+$/.test(values.issi)) { // Solo numeros enteros positivos
                errors.issi = 'Solo acepta números.';
            }
            if (!values.fuente) {
                errors.fuente = 'Requerido';
            } else if (!/^[a-zA-Z0-9\s\-]+$/.test(values.fuente)) {
                errors.fuente = 'Solo acepta letras, números y guiones.';
            }
            if (!values.tipo) {
                errors.tipo = 'Requerido';
            } else if (!/^[0-9]+$/.test(values.tipo)) {
                errors.tipo = 'Solo acepta numeros un numero.'
            }
            if (!values.nombre) {
                errors.nombre = 'Requerido';
            } else if (!/^[a-zA-Z0-9\s\-]+$/.test(values.nombre)) {
                errors.nombre = 'Solo acepta letras, números y guiones.'
            }

            if (values.tipo === 1 || !values.tipo) {
                if (!values.cargo) {
                    errors.cargo = 'Requerido';
                } else if (!/^[a-zA-Z0-9\s\-]+$/.test(values.cargo)) {
                    errors.cargo = 'Solo acepta letras, números y guiones.'
                }
            }
            if (values.tipo === 2 || !values.tipo) {
                if (!values.placa) {
                    errors.placa = 'Requerido';
                } else if (!/^[a-zA-Z0-9\s\-]+$/.test(values.placa)) {
                    errors.placa = 'Solo acepta letras, números y guiones.'
                }
                if (!values.unidad) {
                    errors.unidad = 'Requerido';
                } else if (!/^[a-zA-Z0-9\s\-]+$/.test(values.unidad)) {
                    errors.unidad = 'Solo acepta letras, números y guiones.'
                }
            }

            return errors;
        },
        onSubmit: (values, { setSubmitting }) => {
            handleUpd(values)

        },
    });


    const handleUpd = (values) => {
        const { issi, fuente, tipo, cargo, nombre, placa, unidad } = values;

        const informacion = tipo === 1
            ? { cargo, nombre }
            : { placa, unidad };

        const data = {
            issi,
            fuente,
            informacion
        };
        formik.setSubmitting(true);
        axios.put(`${import.meta.env.VITE_APP_ENDPOINT}/radios/${values.issi}`, data, header())
            .then(response => {
                dispatch(showToast({
                    message: "Radio actualizado",
                    type: "success"
                }))
                handleClose();
                ToggleUpdate();
            })
            .catch(error => {
                console.error("Error actualizando la radio:", error.message);
                dispatch(showToast({
                    message: error.message,
                    type: "error"
                }))
            }).finally(() => {
                formik.setSubmitting(false);
            })
    }

    const handleDelete = () => {
        formik.setSubmitting(true);
        const id = formik.values.issi

        axios.delete(`${import.meta.env.VITE_APP_ENDPOINT}/radios/${id}`, id, header())
            .then(response => {
                dispatch(showToast({
                    message: "La Radio se elimino correctamente",
                    type: "success"
                }))
                handleClose();
                ToggleUpdate();
            })
            .catch(error => {
                console.error("Error aliminando la Radio:", error);
                dispatch(showToast({
                    message: error.message,
                    type: "error"
                }))
            }).finally(() => {
                formik.setSubmitting(false);
            })
    }

    return (
        <>
            <Button onClick={() => setisOpen(true)}>Editar</Button>

            <CustomModal Open={isOpen} setOpen={setisOpen} handleClose={handleClose}>
                <h1 className='text-lg font-bold'>Actualizar Radio</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col mt-3 gap-4'>
                        <Autocomplete
                            options={radios}
                            getOptionLabel={(option) => {
                                const { issi, informacion, fuente } = option;
                                const { cargo, placa, unidad } = informacion;

                                let label = issi;
                                if (cargo) {
                                    label += ` - ${cargo}`;
                                } else if (placa) {
                                    label += ` - ${unidad} - ${placa}`;
                                }
                                label += ` - ${fuente}`;

                                return label;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="ISSI"
                                    variant="standard"
                                    helperText={formik.errors.issi && formik.touched.issi ? formik.errors.issi : 'Ingrese la ISSI.'}
                                    error={Boolean(formik.errors.issi && formik.touched.issi)}
                                    onBlur={formik.handleBlur}
                                />
                            )}
                            id='issi'
                            name='issi'
                            value={radios.find(option => option.issi === formik.values.issi) || null} // Evita undefined
                            onChange={(event, newValue) => {
                                const { issi, informacion, fuente } = newValue || {};
                                const tipo = informacion && typeof informacion === 'object' && ("placa" in informacion)
                                    ? 2
                                    : informacion && typeof informacion === 'object' && ("nombre" in informacion)
                                        ? 1
                                        : '';

                                formik.setFieldValue('issi', issi || ''); // Maneja el caso cuando newValue es null
                                formik.setFieldValue('fuente', fuente || '');
                                formik.setFieldValue('tipo', tipo);
                                formik.setFieldValue('cargo', informacion?.cargo || '');
                                formik.setFieldValue('nombre', informacion?.nombre || '');
                                formik.setFieldValue('placa', informacion?.placa || '');
                                formik.setFieldValue('unidad', informacion?.unidad || '');
                                return newValue;
                            }}
                            onBlur={formik.handleBlur}
                        />
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <TextField
                                size='small'
                                label="Fuente"
                                variant="standard"
                                type='text'
                                className='w-full'
                                id="fuente"
                                name='fuente'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.fuente}
                                error={formik.errors.fuente && formik.touched.fuente}
                                helperText={formik.errors.fuente && formik.touched.fuente ? formik.errors.fuente : 'Ingrese la fuente para la ISSI.'}
                            />
                            <FormControl size='small' variant='standard' className='w-full' error={formik.errors.tipo && formik.touched.tipo}>
                                <InputLabel id="Tipo-label">Tipo unidad</InputLabel>
                                <Select
                                    labelId="Tipo-label"
                                    id="Tipo"
                                    value={formik.values.tipo}
                                    label="Tipo unidad"
                                    name='tipo'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    {TIPO_UNIDAD?.map((Tipo, index) => (
                                        <MenuItem key={index} value={Tipo.value}>{Tipo.label}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.errors.tipo && formik.touched.tipo ? formik.errors.tipo : 'Seleccione un tipo de unidad'}</FormHelperText>
                            </FormControl>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            {formik.values.tipo === 2 ?
                                <>
                                    <TextField
                                        size='small'
                                        label="Nombre conductor"
                                        variant="standard"
                                        type='text'
                                        className='w-full'
                                        id="nombre"
                                        name='nombre'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.nombre}
                                        error={formik.errors.nombre && formik.touched.nombre}
                                        helperText={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : 'Ingrese el nombre.'}
                                    />
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                        <TextField
                                            size='small'
                                            label="Placa"
                                            variant="standard"
                                            type='text'
                                            className='w-full'
                                            id="placa"
                                            name='placa'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.placa}
                                            error={formik.errors.placa && formik.touched.placa}
                                            helperText={formik.errors.placa && formik.touched.placa ? formik.errors.placa : 'Ingrese la placa.'}
                                        />
                                        <TextField
                                            size='small'
                                            label="Unidad"
                                            variant="standard"
                                            type='text'
                                            className='w-full'
                                            id="unidad"
                                            name='unidad'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.unidad}
                                            error={formik.errors.unidad && formik.touched.unidad}
                                            helperText={formik.errors.unidad && formik.touched.unidad ? formik.errors.unidad : 'Ingrese la unidad.'}
                                        />
                                    </div>
                                </>
                                :
                                <>
                                    <TextField
                                        size='small'
                                        label="Cargo"
                                        variant="standard"
                                        type='text'
                                        className='w-full'
                                        id="cargo"
                                        name='cargo'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.cargo}
                                        error={formik.errors.cargo && formik.touched.cargo}
                                        helperText={formik.errors.cargo && formik.touched.cargo ? formik.errors.cargo : 'Ingrese el Cargo'}
                                    />
                                    <TextField
                                        size='small'
                                        label="Nombre"
                                        variant="standard"
                                        type='text'
                                        className='w-full'
                                        id="nombre"
                                        name='nombre'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.nombre}
                                        error={formik.errors.nombre && formik.touched.nombre}
                                        helperText={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : 'Ingrese el nombre.'}
                                    />
                                </>
                            }
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                <DeleteRadios onAccept={handleDelete} issi={formik.values.issi} />
                            </div>
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

export default UpdRadios