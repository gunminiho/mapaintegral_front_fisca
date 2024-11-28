// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';

// Importa los reducers que crearás más adelante
import menuOptionSlice from "../slices/menuOptionsReducer";
import unitsSlice from '../slices/unitsReducer';
import radiosSlice from '../slices/RadiosReducers'
import toastsSlice from '../slices/toastsSlice';
import AreasSlice from '../slices/AreasSlice';
import CelularesSlice from '../slices/CelularesSlice';
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../../Components/helpers/localStorageUtils';
import AuthSlice from '../slices/AuthSlice';


const preloadedState = loadStateFromLocalStorage();

// Configura el store con los reducers importados
export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        menuOptions: menuOptionSlice,
        units: unitsSlice,
        radios: radiosSlice,
        toasts: toastsSlice,
        areas: AreasSlice,
        celulares: CelularesSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }),
    preloadedState
});

store.subscribe(() => {
    saveStateToLocalStorage(store.getState());
});


export default store;