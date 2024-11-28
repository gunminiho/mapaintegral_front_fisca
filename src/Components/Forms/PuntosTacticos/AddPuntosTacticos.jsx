import { Button, duration, FormControl, FormHelperText, InputLabel, MenuItem, Select, styled, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CustomModal from '../../Modal/CustomModal'
import { useFormik } from 'formik'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TURNOS, ZONAS } from '../../helpers/Const';
import axios from 'axios';
import header from '../../helpers/postHeaders';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../redux/slices/toastsSlice';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function AddPuntosTacticos({ ToggleUpdate }) {
    const [isOpen, setisOpen] = useState(false);

    const dispatch = useDispatch();

    // Configuración de useFormik
    const formik = useFormik({
        initialValues: {
            nombre: "",
            turno: "",
            zona: "",
            nombreFile: "",
            puntos: {},
        },
        validate: values => {
            const errors = {};

            if (!values.nombre) {
                errors.nombre = 'Requerido';
            } else if (!/^[a-zA-Z0-9\s\-]+$/.test(values.nombre)) {
                errors.nombre = 'Solo acepta letras, números y guiones.';
            }
            if (values.turno === null || values.turno === undefined || values.turno === '') {
                errors.turno = 'Requerido';
            } else if (values.turno < 0 || values.turno > 2) {
                errors.turno = 'Debe estar entre 0 y 2.';
            }

            if (values.zona === null || values.zona === undefined || values.zona === '') {
                errors.zona = 'Requerido';
            } else if (values.zona < 0 || values.zona > 7) {
                errors.zona = 'Debe estar entre 0 y 7.';
            }
            if (Object.keys(values.puntos).length === 0) {
                errors.puntos = 'No ha seleccionado el archivo.';
            }
            return errors;
        },
        onSubmit: (values, { setSubmitting }) => {
            handleAdd(values)
        },
    });

    const handleClose = () => {
        setisOpen(false);   // Cierra el modal
        formik.resetForm(); // Reinicia el formulario
    };

    const handleFileChange = (event) => {
        const [file] = event.target.files; // Desestructuración para obtener el archivo

        if (!file) return; // Retornar temprano si no hay archivo

        const reader = new FileReader();

        reader.onload = ({ target }) => {
            try {
                const geojson = JSON.parse(target.result);              

                // Validaciones del formato GeoJSON
                if (!geojson.features || geojson.features.length === 0) {
                    throw new Error('El archivo no tiene el formato correcto');
                }

                if (geojson.features[0].geometry.type !== "Point") {
                    throw new Error('Los puntos tacticos no tienen el formato correcto');
                }

                // Actualizar los valores del formulario
                formik.setFieldValue('puntos', geojson);
                formik.setFieldValue('nombreFile', file.name);
            } catch (error) {
                // Limpiar los campos y mostrar el mensaje de error
                formik.setFieldValue('puntos', {});
                formik.setFieldValue('nombreFile', "");

                dispatch(showToast({
                    message: error.message,
                    type: "error",
                    duration: 2000
                }));
                console.error('Error al parsear el GeoJSON:', error);
            }
        };

        reader.onerror = () => {
            console.error('Error al leer el archivo');
            dispatch(showToast({
                message: 'Error al leer el archivo',
                type: "error",
                duration: 2000
            }));
        };

        // Leer el archivo como texto
        reader.readAsText(file);

        // Limpiar el valor del input para permitir cargar el mismo archivo nuevamente
        event.target.value = '';
    };

    const handleAdd = (values) => {
        formik.setSubmitting(true);

        axios.post(`${import.meta.env.VITE_APP_ENDPOINT}/puntostacticos/`, values, header())
            .then(response => {
                dispatch(showToast({
                    message: "Punto tactico agregado",
                    type: "success"
                }));
                handleClose();
                ToggleUpdate()
            })
            .catch(error => {
                dispatch(showToast({
                    message: error.message,
                    type: "error"
                }));

                console.error('Error al agregar el punto tactico:', error);
            }).finally(() => {
                formik.setSubmitting(false);
            })
    };

    return (
        <>
            <Button onClick={() => setisOpen(true)}>Agregar</Button>

            {/* Paso handleClose aquí */}
            <CustomModal Open={isOpen} setOpen={setisOpen} handleClose={handleClose}>
                <h1 className='text-lg font-bold'>Nuevo punto tactico</h1>

                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col mt-3 gap-4'>
                        <div>
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
                                helperText={formik.errors.nombre && formik.touched.nombre ? formik.errors.nombre : 'Ingrese el nombre del punto táctico.'}
                            />
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
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
                                    {TURNOS.map((turno, index) => (
                                        <MenuItem key={index} value={turno.value}>{turno.label}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.errors.turno && formik.touched.turno ? formik.errors.turno : 'Seleccione el turno'}</FormHelperText>
                            </FormControl>
                            <FormControl size='small' variant='standard' error={formik.errors.zona && formik.touched.zona}>
                                <InputLabel id="Zona-label">Zona</InputLabel>
                                <Select
                                    labelId="Zona-label"
                                    id="Zona"
                                    value={formik.values.zona}
                                    label="Zona"
                                    name='zona'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    {ZONAS.map((zona, index) => (
                                        <MenuItem key={index} value={zona.value}>{zona.label}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{formik.errors.zona && formik.touched.zona ? formik.errors.zona : 'Seleccione el Zona'}</FormHelperText>
                            </FormControl>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                color='inherit'

                            >
                                Subir GeoJSON
                                <VisuallyHiddenInput
                                    type="file"
                                    accept='.geojson'
                                    onChange={handleFileChange}
                                />
                            </Button>

                            {
                                formik.values.nombreFile ?
                                    <p className='text-green-700 text-sm'>{formik.values.nombreFile}</p>
                                    :
                                    formik.touched.puntos && formik.errors.puntos ?
                                        <p className='text-red-500 text-sm'>{formik.errors.puntos}</p>
                                        :
                                        <p className='text-gray-800 text-sm'>Seleccione un archivo.</p>
                            }
                        </div>
                        <div className='flex justify-between'>
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
    );
}

export default AddPuntosTacticos;
