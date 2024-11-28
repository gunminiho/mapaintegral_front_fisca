import { Button, Fab } from '@mui/material'
import React, { useState } from 'react'
import NearbyOffTwoToneIcon from '@mui/icons-material/NearbyOffTwoTone';
import CustomModal from '../../Modal/CustomModal';

const ReiniciarVigilancia = ({ CleanVigilancia }) => {

    const [isOpen, setisOpen] = useState(false);
    const handleClose = () => {
        setisOpen(false);   // Cierra el modal
    }
    const onAccept = () => {
        CleanVigilancia();
        setisOpen(false);   // Cierra el modal
    }
    const handleOpen = () => {
        setisOpen(true);   // Abre el modal
    };

    return (
        <>
            <Fab
                variant="extended"
                size="medium"
                color="primary"
                onClick={handleOpen}
            >
                <NearbyOffTwoToneIcon sx={{ mr: 1 }} />
                Reiniciar Vigilancia
            </Fab>
            <CustomModal Open={isOpen} setOpen={setisOpen} handleClose={handleClose} className={"max-w-lg"}>
                <h2 className='font-bold text-lg mb-3'>¿Deseas reiniciar la vigilancia?</h2>
                <p className='text-gray-500 font-medium'>Esta acción es irreversible y se eliminaran todos los dispositivos en vigilancia</p>
                <div className='flex justify-end mt-8 gap-3'>
                    <Button type='button' variant="contained" color="inherit" onClick={handleClose}>Cancelar</Button>
                    <Button type='button' variant="contained" color="error" onClick={() => { handleClose(); onAccept() }}>Aceptar</Button>
                </div>
            </CustomModal>
        </>
    )
}

export default ReiniciarVigilancia