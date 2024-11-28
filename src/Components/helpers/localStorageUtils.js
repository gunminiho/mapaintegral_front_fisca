// Función para guardar el estado en localStorage
export const saveStateToLocalStorage = (state) => {
    try {
        const stateWithoutToast = {
            ...state,
            toasts: {
                ...state.toasts,
                toasts: []
            }
        };
        const serializedState = JSON.stringify(stateWithoutToast);
        localStorage.setItem('vigilaciaState', serializedState);
    } catch (err) {
        console.error("No se pudo guardar el estado en localStorage", err);
    }
};

// Función para recuperar el estado desde localStorage
export const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('vigilaciaState');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("No se pudo recuperar el estado desde localStorage", err);
        return undefined;
    }
};