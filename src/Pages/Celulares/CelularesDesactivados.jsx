import { Button, duration, FormControl, IconButton, Input, InputAdornment, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { showToast } from '../../redux/slices/toastsSlice';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SearchIcon from '@mui/icons-material/Search';
import { filterAndSortData } from '../../Components/helpers/Functions';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Link, useNavigate } from 'react-router-dom';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const CelularesDesactivados = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;
    const [celularesDesactivados, setCelularesDesactivados] = useState([])
    const [orderBy, setOrderBy] = useState('member');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [Update, setUpdate] = useState(false)

    function FetchCelularesDesactivados() {
        axios.get(`${endpoint}/usuarios/activate`)
            .then((res) => {
                setCelularesDesactivados(res.data.data)
                dispatch(showToast({
                    message: 'Se encontraron ' + res.data.data.length + ' celulares',
                    type: 'info',
                    duration: 1000
                }));
            })
            .catch((err) => {
                console.error(err)
            })
    }

    useEffect(() => {
        FetchCelularesDesactivados()
    }, [Update])

    const onAccept = (id) => {
        axios.put(`${endpoint}/usuarios/activate/${id}`)
            .then((res) => {
                FetchCelularesDesactivados()
                dispatch(showToast({ message: 'Se acepto el celular', type: 'success', duration: 2000 }))
            })
            .catch((err) => {
                dispatch(showToast({ message: 'Ocurrio un error', type: 'error', duration: 2000 }))
                console.error(err)
            })
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filtrar y ordenar los datos
    const filterCelular = (celular, searchTerm) => {
        return (
            celular.member?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            celular.nombres?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            celular.apellidos?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            celular.telefono?.toString().includes(searchTerm?.toLowerCase()) ||
            celular.dni?.toString().includes(searchTerm?.toLowerCase()) ||
            celular.superior?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            celular.TurnoAsociado?.nombre?.toLowerCase().includes(searchTerm?.toLowerCase())
        );
    };

    const sortedData = filterAndSortData(celularesDesactivados, searchTerm, orderBy, orderDirection, filterCelular)

    const refreshData = () => {
        setUpdate(!Update)
    }

    return (
        <>
            <div className='p-4 flex'>
                <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
                    <ArrowBackIosNewRoundedIcon sx={{ color: "#475569", width: '1.5rem', height: '1.5rem', marginTop: '0.2rem' }} />
                    <h1 className='text-3xl font-bold text-slate-600'>Celulares Desactivados</h1>
                </Link>
            </div>
            <main className='flex flex-1 w-full overflow-hidden'>
                <div className='bg-white shadow rounded-lg p-4 flex flex-col flex-1 overflow-hidden'>
                    <div className='w-full flex justify-space-between pb-3'>
                        <div className='w-full flex items-center gap-2'>
                            <span className='text-gray-600'>Total de filas: <span id="rowCount" className='font-bold'>{sortedData ? sortedData.length : 0}</span></span>
                            <IconButton aria-label="refresh" onClick={refreshData}>
                                <RefreshRoundedIcon sx={{ color: "#0098e5" }} />
                            </IconButton>
                        </div>
                        <FormControl variant="standard" size='small'>
                            <InputLabel htmlFor="input-with-icon-adornment">
                                Buscar
                            </InputLabel>
                            <Input
                                id="input-with-icon-adornment"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </div>
                    <div className='overflow-auto flex flex-1 w-full'>
                        <div className='w-full'>
                            <Table size='small' >
                                <TableHead className='bg-gray-200'>
                                    <TableRow>
                                        <TableCell className='min-w-28'>
                                            <TableSortLabel
                                                active={orderBy === 'member'}
                                                direction={orderBy === 'member' ? orderDirection : 'asc'}
                                                onClick={() => handleSortRequest('member')}
                                            >
                                                ID
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'nombres'}
                                                direction={orderBy === 'nombres' ? orderDirection : 'asc'}
                                                onClick={() => handleSortRequest('nombres')}
                                            >
                                                Nombres
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'apellidos'}
                                                direction={orderBy === 'apellidos' ? orderDirection : 'asc'}
                                                onClick={() => handleSortRequest('apellidos')}
                                            >
                                                Apellidos
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'telefono'}
                                                direction={orderBy === 'telefono' ? orderDirection : 'asc'}
                                                onClick={() => handleSortRequest('telefono')}
                                            >
                                                Telefono
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'dni'}
                                                direction={orderBy === 'dni' ? orderDirection : 'asc'}
                                                onClick={() => handleSortRequest('dni')}
                                            >
                                                DNI
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'superior'}
                                                direction={orderBy === 'superior' ? orderDirection : 'asc'}
                                                onClick={() => handleSortRequest('superior')}
                                            >
                                                Superior
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'TurnoAsociado.nombre'}
                                                direction={orderBy === 'TurnoAsociado.nombre' ? orderDirection : 'asc'}
                                                onClick={() => handleSortRequest('TurnoAsociado.nombre')}
                                            >
                                                Turno
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Activar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!sortedData || sortedData.length === 0 ?
                                        <TableRow>
                                            <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                                No hay celulares desactivados
                                            </TableCell>
                                        </TableRow>
                                        :
                                        sortedData?.map((celular) => (
                                            <TableRow key={celular.id}>
                                                <TableCell>{celular.member}</TableCell>
                                                <TableCell>{celular.nombres}</TableCell>
                                                <TableCell>{celular.apellidos}</TableCell>
                                                <TableCell>{celular.telefono}</TableCell>
                                                <TableCell>{celular.dni}</TableCell>
                                                <TableCell>{celular.superior}</TableCell>
                                                <TableCell>{celular.TurnoAsociado.nombre}</TableCell>
                                                <TableCell>
                                                    <IconButton variant="contained" color="success" size='small' onClick={() => onAccept(celular.member)} >
                                                        <CheckRoundedIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CelularesDesactivados