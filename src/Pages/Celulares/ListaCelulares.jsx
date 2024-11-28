import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { showToast } from '../../redux/slices/toastsSlice';
import { useDispatch } from 'react-redux';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import UpdCelulares from '../../Components/Forms/Celulares/UpdCelulares';
import SearchIcon from '@mui/icons-material/Search';
import { filterAndSortData } from '../../Components/helpers/Functions';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const ListaCelulares = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const endpoint = `${import.meta.env.VITE_APP_ENDPOINT}`;
    const [listaCelulares, setListaCelulares] = useState([])
    const [SelectedCelular, setSelectedCelular] = useState(null)
    const [orderBy, setOrderBy] = useState('member');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [Update, setUpdate] = useState(false)

    function FetchCelulares() {
        axios.get(`${endpoint}/usuarios`)
            .then((res) => {
                setListaCelulares(res.data.data)
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
        FetchCelulares()
    }, [Update])


    const onDisabled = (id) => {
        axios.delete(`${endpoint}/usuarios/${id}`)
            .then((res) => {
                FetchCelulares()
                dispatch(showToast({ message: 'Se deshabilito el celular', type: 'success', duration: 2000 }))
            })
            .catch((err) => {
                dispatch(showToast({ message: 'Ocurrio un error', type: 'error', duration: 2000 }))
                console.error(err)
            })
    }

    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filtrar y ordenar los datos
    const filterCelular = (celular, searchTerm) => {
        return (
            celular.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.telefono.toString().includes(searchTerm.toLowerCase()) ||
            celular.dni.toString().includes(searchTerm.toLowerCase()) ||
            celular.superior.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.TurnoAsociado.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const sortedData = filterAndSortData(listaCelulares, searchTerm, orderBy, orderDirection, filterCelular)

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const refreshData = () => {
        setUpdate(!Update)
    }

    return (
        <>
            <div className='p-4 flex overflow-hidden'>
                <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
                    <ArrowBackIosNewRoundedIcon sx={{ color: "#475569", width: '1.5rem', height: '1.5rem', marginTop: '0.2rem' }} />
                    <h1 className='text-3xl font-bold text-slate-600'>Lista de Celulares</h1>
                </Link>
            </div>
            <main className='flex flex-1 w-full overflow-hidden'>
                <div className='bg-white shadow rounded-lg p-4 w-full flex flex-col flex-1 overflow-hidden'>
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
                        <Table size='small' stickyHeader>
                            <TableHead className='bg-gray-200'>
                                <TableRow>
                                    <TableCell className='min-w-28 !bg-gray-200'>
                                        <TableSortLabel
                                            active={orderBy === 'member'}
                                            direction={orderBy === 'member' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('member')}
                                        >
                                            ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='!bg-gray-200'>
                                        <TableSortLabel
                                            active={orderBy === 'nombres'}
                                            direction={orderBy === 'nombres' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('nombres')}
                                        >
                                            Nombres
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='!bg-gray-200'>
                                        <TableSortLabel
                                            active={orderBy === 'apellidos'}
                                            direction={orderBy === 'apellidos' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('apellidos')}
                                        >
                                            Apellidos
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='!bg-gray-200'>
                                        <TableSortLabel
                                            active={orderBy === 'telefono'}
                                            direction={orderBy === 'telefono' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('telefono')}
                                        >
                                            Telefono
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='!bg-gray-200'>
                                        <TableSortLabel
                                            active={orderBy === 'dni'}
                                            direction={orderBy === 'dni' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('dni')}
                                        >
                                            DNI
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='!bg-gray-200'>
                                        <TableSortLabel
                                            active={orderBy === 'superior'}
                                            direction={orderBy === 'superior' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('superior')}
                                        >
                                            Superior
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='!bg-gray-200'>
                                        <TableSortLabel
                                            active={orderBy === 'TurnoAsociado.nombre'}
                                            direction={orderBy === 'TurnoAsociado.nombre' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('TurnoAsociado.nombre')}
                                        >
                                            Turno
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='!bg-gray-200'>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!sortedData || sortedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                            No hay celulares activos
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedData.map((celular) => (
                                        <TableRow key={celular.id} className={`${celular.state ? '' : 'text-red-50'}`}>
                                            <TableCell>{celular.member}</TableCell>
                                            <TableCell>{celular.nombres}</TableCell>
                                            <TableCell>{celular.apellidos}</TableCell>
                                            <TableCell>{celular.telefono}</TableCell>
                                            <TableCell>{celular.dni}</TableCell>
                                            <TableCell>{celular.superior}</TableCell>
                                            <TableCell>{celular.TurnoAsociado.nombre}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    variant="contained"
                                                    color="primary"
                                                    size='small'
                                                    onClick={() => { setSelectedCelular(celular) }}
                                                >
                                                    <EditRoundedIcon />
                                                </IconButton>
                                                <IconButton
                                                    variant="contained"
                                                    color="error"
                                                    size='small'
                                                    onClick={() => { onDisabled(celular.member) }}
                                                >
                                                    <DoDisturbIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <UpdCelulares data={SelectedCelular} set={setSelectedCelular} FetchCelulares={FetchCelulares} />
            </main>
        </>
    )
}

export default ListaCelulares