import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Switch, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { filterAndSortData } from '../../Components/helpers/Functions';
import SearchIcon from '@mui/icons-material/Search';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { socket } from '../../Components/Socket/socket';
import { setCelulares } from '../../redux/slices/CelularesSlice';
import { showToast } from '../../redux/slices/toastsSlice';
import axios from 'axios';
import UseCelulares from '../../Hooks/UseCelulares';

const CelularesSinSenal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [listaCelulares, setListaCelulares] = useState([])
    const [orderBy, setOrderBy] = useState('inactiveTime.difference');
    const [orderDirection, setOrderDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const { celularesSinSenal } = useSelector((state) => state.celulares);
    const [Update, setUpdate] = useState(false)

    useEffect(() => {
            const withoutSenal = celularesSinSenal.filter((celular) => {
            const inactiveTime = celular.inactiveTime;
            const isInactive =
                (inactiveTime.type === 'minutes' && inactiveTime.value >= 5) ||
                (inactiveTime.type === 'hours' && inactiveTime.value >= 1) ||
                (inactiveTime.type === 'days' && inactiveTime.value >= 1);

            return isInactive;
        });
        setListaCelulares(withoutSenal)
    }, [celularesSinSenal])


    const handleSortRequest = (property) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filtrar y ordenar los datos
    const filterCelular = (celular, searchTerm) => {
        return (
            celular.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.telefono.toString().includes(searchTerm.toLowerCase()) ||
            celular.dni.toString().includes(searchTerm.toLowerCase()) ||
            celular.superior.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.turno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            celular.inactiveTime.label.toString().includes(searchTerm.toLowerCase())
        );
    };

    const sortedData = filterAndSortData(listaCelulares, searchTerm, orderBy, orderDirection, filterCelular)

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const FollorCelular = (id) => {
        window.open(`/vigilancia/${id}`, '_blank');
    }

    const refreshData = () => {
        setUpdate(!Update)
    }

    UseCelulares()
    return (
        <>
            <div className='p-4 flex'>
                <Link onClick={() => navigate(-1)} className='flex items-center gap-1'>
                    <ArrowBackIosNewRoundedIcon sx={{ color: "#475569", width: '1.5rem', height: '1.5rem', marginTop: '0.2rem' }} />
                    <h1 className='text-3xl font-bold text-slate-600'>Celulares sin señal</h1>
                </Link>
            </div>
            <main >
                <div className='bg-white shadow rounded-lg p-4'>
                    <div className='w-full flex justify-space-between pb-3'>
                        <div className='w-full flex items-center gap-2'>
                            <span className='text-gray-600'>Total de filas: <span id="rowCount" className='font-bold'>{sortedData ? sortedData.length : 0}</span></span>
                            {/* <IconButton aria-label="refresh" onClick={refreshData}>
                                <RefreshRoundedIcon sx={{ color: "#0098e5" }}/>
                            </IconButton> */}
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
                    <div className='overflow-x-auto'>
                        <Table size='small' >
                            <TableHead className='bg-gray-200'>
                                <TableRow>
                                    <TableCell className='min-w-28'>
                                        <TableSortLabel
                                            active={orderBy === 'id'}
                                            direction={orderBy === 'id' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('id')}
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
                                            active={orderBy === 'turno'}
                                            direction={orderBy === 'turno' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('turno')}
                                        >
                                            Turno
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'inactiveTime.difference'}
                                            direction={orderBy === 'inactiveTime.difference' ? orderDirection : 'asc'}
                                            onClick={() => handleSortRequest('inactiveTime.difference')}
                                        >
                                            Inactividad
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!sortedData || sortedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                                            No hay celulares sin señal
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedData.map((celular) => (
                                        <TableRow onClick={() => FollorCelular(celular.id)} key={celular.id} className={`hover:bg-gray-100 cursor-pointer ${celular.state ? '' : 'text-red-50'}`}>
                                            <TableCell>{celular.id}</TableCell>
                                            <TableCell>{celular.nombres}</TableCell>
                                            <TableCell>{celular.apellidos}</TableCell>
                                            <TableCell>{celular.telefono}</TableCell>
                                            <TableCell>{celular.dni}</TableCell>
                                            <TableCell>{celular.superior}</TableCell>
                                            <TableCell>{celular.turno}</TableCell>
                                            <TableCell>{celular.inactiveTime.label}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CelularesSinSenal