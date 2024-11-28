import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    radios: [],

};

const radiosSlice = createSlice({

    name: "radiosSlice",
    initialState,
    reducers: {
        setRadios: (state, action) => {
            state.radios = action.payload;
        },
    }
});

export const { setRadios } = radiosSlice.actions;

export default radiosSlice.reducer;