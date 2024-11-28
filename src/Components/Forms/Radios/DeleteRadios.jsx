import { Button } from '@mui/material';
import React, { useState } from 'react'
import CustomModal from '../../Modal/CustomModal';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../redux/slices/toastsSlice';

const DeleteRadios = ({onAccept, issi}) => {
    const [isOpen, setisOpen] = useState(false);
    const dispatch = useDispatch();

    const handleClose = () => {
        setisOpen(false);   // Cierra el modal
    };
    const handleOpen = () => {
        if (issi) {
            setisOpen(true);   // Abre el modal

        } else {
            dispatch(showToast({
                message: "Debe tener una ISSI seleccionado",
                type: "error",
            }))
        }

    };
    return (
        <>
            <Button type='button' variant="contained" color="error" onClick={handleOpen}>Eliminar</Button>

            <CustomModal Open={isOpen} setOpen={setisOpen} handleClose={handleClose} className={"max-w-lg"}>
                <h2 className='font-bold text-lg mb-3'>¿Deseas eliminar esta Radio?</h2>
                <p className='text-gray-500 font-medium'>Esta acción es irreversible y no se podrá deshacer una vez confirmada</p>
                <div className='flex justify-end mt-8 gap-3'>
                    <Button type='button' variant="contained" color="inherit" onClick={handleClose}>Cancelar</Button>
                    <Button type='button' variant="contained" color="error" onClick={() => { handleClose(); onAccept() }}>Aceptar</Button>
                </div>
            </CustomModal>
        </>
    )
}

export default DeleteRadios