import React from 'react'
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UseCelulares from '../Hooks/UseCelulares';


const Inicio = () => {
  const { resumen_celulares, turno } = useSelector((state) => state.celulares);

  UseCelulares()
  return (
    <>
      <div className='p-4'>
        <h1 className='text-3xl font-bold text-slate-600'>Dashboard</h1>
      </div>
      <main>
        <div className='p-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:gap-7'>
            <Link
              to={'/celular/sin-señal'}
              className="relative flex items-center justify-between rounded-lg border border-stroke bg-white px-6 py-5 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">Celulares sin señal</span>
                <h4 className="text-3xl font-bold text-black">
                  {resumen_celulares.sinSeñal || 0} / {resumen_celulares.total || 0}
                </h4>
                <span className="text-xs text-gray-600">Turno: {turno}</span>
              </div>

              <div className="flex items-center justify-center flex-col">
                <LocationOffOutlinedIcon sx={{ color: "#0098e5", width: '3rem', height: '3rem' }} />
              </div>

              <div className="absolute right-3 flex items-center">
                <ArrowForwardIosRoundedIcon sx={{ color: "#475569", width: '1rem', height: '1rem' }} />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Inicio