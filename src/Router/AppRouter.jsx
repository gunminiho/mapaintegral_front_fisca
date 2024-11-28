import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Inicio from '../Pages/Inicio';
import Vigilancia from '../Pages/Vigilancia';
import PrivateRouter from './PrivateRouter';
import ListaCelulares from '../Pages/Celulares/ListaCelulares';
import Layout from '../Pages/Layout';
import CelularesDesactivados from '../Pages/Celulares/CelularesDesactivados';
import Emergencias from '../Pages/Emergencias';
import CelularesSinSenal from '../Pages/Celulares/CelularesSinSenal';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRouter element={<Layout />} />,
    children: [
      {
        path: "/",
        element: <PrivateRouter element={<Inicio />} />,
      },
      {
        path: "/celular",
        element: <PrivateRouter element={<Outlet />} />,
        children: [
          {
            path: "/celular",
            element: <PrivateRouter element={<ListaCelulares />} />,
          },
          {
            path: "/celular/desactivados",
            element: <PrivateRouter element={<CelularesDesactivados />} />,
          },
          {
            path: "/celular/sin-señal",
            element: <PrivateRouter element={<CelularesSinSenal />} />,
          },
        ]
      },
      {
        path: "/emergencias",
        element: <PrivateRouter element={<Emergencias />} />,
      },
    ]
  },
  {
    path: "/vigilancia/:id?",
    element: <PrivateRouter element={<Vigilancia />} />,
  },
  // {
  //     path: "/login",
  //     element: <PublicRouter element={<Login />} />,
  // },
  // {
  //     path: "/registro",
  //     element: <PublicRouter element={<Register />} />,
  // },

]);


const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default AppRouter