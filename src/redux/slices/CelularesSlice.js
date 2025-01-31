import { createSlice } from '@reduxjs/toolkit'
import { calculateInactiveTime, CheckIsInTurn, FilterWithTurn } from '../../Components/helpers/Functions';

const initialState = {
    celulares: [],
    celularesFiltered: [],
    celularesSinSenal: [],
    resumen_celulares: {},
    turno: "Mañana",
    celularFollowed: null,
    celularIsFollowed: false,
}

const CelularesSlice = createSlice({
    name: "celulares",
    initialState,
    reducers: {
        setCelulares: (state, action) => {

            const celulares = action.payload.map(celular => {
                const inactiveTime = calculateInactiveTime(celular.date); // Llamamos a la función externa
                
                return {
                    ...celular,
                    inactiveTime // Agregamos el tiempo de inactividad como un nuevo atributo
                };
            });


            const shiftRanges = [
                { start: 7, end: 15, label: "Mañana" },  // Turno mañana (7am - 3pm)
                { start: 15, end: 23, label: "Tarde" }, // Turno tarde (3pm - 11pm)
                { start: 23, end: 7, label: "Noche" }   // Turno noche (11pm - 7am)
            ];

            const now = new Date();
            const hour = now.getHours();
            const currentTurn = shiftRanges.find((range) => {
                if (range.start < range.end) {
                    // Caso típico, donde el turno no cruza medianoche
                    return hour >= range.start && hour < range.end;
                } else {
                    // Caso especial para el turno de noche que cruza medianoche
                    return hour >= range.start || hour < range.end;
                }
            });

            let sinSeñalCount = 0;
            const withTurn = celulares?.filter((celular) => {
                
                const inactiveTime = calculateInactiveTime(celular?.date); // Llamamos a la función externa
                const isInactive =
                    (inactiveTime?.type === 'minutes' && inactiveTime?.value >= 1) ||
                    (inactiveTime?.type === 'hours' && inactiveTime?.value >= 1) ||
                    (inactiveTime?.type === 'days' && inactiveTime?.value >= 1);
                    
                if (isInactive && celular?.turno === currentTurn?.label) {
                    sinSeñalCount++;
                }
                return celular?.turno === currentTurn?.label;

            });
            

            state.celulares = celulares;
            state.celularesSinSenal = withTurn;
            state.resumen_celulares.sinSeñal = sinSeñalCount;
            state.resumen_celulares.total = withTurn.length;
            state.turno = currentTurn.label;
        },
        setCelularFollowed: (state, action) => {
            state.celularFollowed = action.payload;
        },
        setIsFollowedCelular: (state, action) => {
            state.celularIsFollowed = action.payload;
        },
        setCelularesFiltered: (state, action) => {
            state.celularesFiltered = action.payload;
        }
    }
});

export const { setCelulares, setCelularFollowed, setIsFollowedCelular, setCelularesFiltered } = CelularesSlice.actions

export default CelularesSlice.reducer