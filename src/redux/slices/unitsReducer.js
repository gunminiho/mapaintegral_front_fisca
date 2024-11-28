import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    unidades: [],
    resumen: {},
    issiFollowed: null,
    isFollowed: false,
    unidadesFiltered: [],

};

const unitsSlice = createSlice({

    name: "unitsSlice",
    initialState,
    reducers: {
        addUnits: (state, action) => {
            state.unidades.push(action.payload);
        },
        setUnits: (state, action) => {
            state.unidades = action.payload;
        },
        setResumen: (state, action) => {
            state.resumen = action.payload;
        },
        setIssiFollowed: (state, action) => {
            state.issiFollowed = action.payload;
        },
        setIsFollowed: (state, action) => {
            state.isFollowed = action.payload;
        },
        setUnidadesFiltered: (state, action) => {
            state.unidadesFiltered = action.payload;
        }
    }
});

export const { addUnits, setUnits, setResumen, setIsFollowed, setIssiFollowed, setUnidadesFiltered } = unitsSlice.actions;

export default unitsSlice.reducer;