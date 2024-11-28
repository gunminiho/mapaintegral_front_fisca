import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    gridState: false,
    selectedGrids: [],
    selectGrids: false,
};

const menuOptionSlice = createSlice({

    name: "menuOptionSlice",
    initialState,
    reducers: {
        setGridState: (state, action) => {
            state.gridState = action.payload;
        },
        setSelectedGrids: (state, action) => {
            state.selectedGrids.push(action.payload); // Agrega el nuevo punto
        },
        deleteSelectedGrid: (state, action) => {
            const {latitud, longitud} = action.payload; 
            state.selectedGrids = state.selectedGrids.filter((grid) => !(grid.latitud === latitud && grid.longitud === longitud));
        },
        clearListGrid: (state) => {

            state.selectedGrids = [];
        },
        setSelectGrids: (state, action) => {
            state.selectGrids = action.payload;
        },
    }
});

export const { setGridState, setSelectedGrids, setSelectGrids, deleteSelectedGrid, clearListGrid } = menuOptionSlice.actions;

export default menuOptionSlice.reducer;