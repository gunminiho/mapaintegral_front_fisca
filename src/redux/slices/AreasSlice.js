import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Subsectores: [],
    Circulos: [],
    puntosTacticos: [],
    Jurisdicciones: [],
    selected: []
};

const areasSlice = createSlice({

    name: "areas",
    initialState,
    reducers: {
        setSubsectores: (state, action) => {
            state.Subsectores = action.payload;

        },
        setJurisdicciones: (state, action) => {
            state.Jurisdicciones = action.payload;

        },
        setCirculos: (state, action) => {
            state.Circulos = action.payload;
        },
        setCuadrados: (state, action) => {
            state.Cuadrados = action.payload;
        },
        setPuntosTacticos: (state, action) => {
            state.puntosTacticos = action.payload;
        },
        addPuntosTacticos: (state, action) => {
            state.selected.push(action.payload);
        },
        removePuntoTactico: (state, action) => {
            state.selected = state.selected.filter(punto => punto.id != action.payload);
        }

    }
});

export const { setSubsectores,setJurisdicciones, setCirculos, setCuadrados, setPuntosTacticos, addPuntosTacticos, removePuntoTactico } = areasSlice.actions;

export default areasSlice.reducer;