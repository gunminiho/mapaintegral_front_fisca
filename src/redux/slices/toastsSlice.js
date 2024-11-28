import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

export const toastsSlice = createSlice({
    name: 'toasts',
    initialState: {
        toasts: [],
        isListening: false,
        expandedClusters: {},
    },
    reducers: {
        setIsListening: (state, action) => {
            state.isListening = action.payload;
        },
        setToasts: (state, action) => {
            state.toasts = action.payload;
        },
    
        showToast: (state, action) => {
            const {
                message = message,
                id = uuidv4(),
                type = 'success',
                duration = 1500,
                onClick = () => { },
                onClose = () => { },
                vertical = 'top',
                horizontal = 'right',
                title = null,
                cluster = null,
                followPoint = () => { },
                followArea = () => { }
            } = action.payload;

            state.toasts.push({
                id: id,
                message: message,
                type: type,
                duration: duration,
                onClick: onClick,
                onClose: onClose,
                vertical: vertical,
                horizontal: horizontal,
                title: title,
                cluster: cluster,
                followPoint: followPoint,
                followArea: followArea
            });
        },

        handleCloseToast: (state, action) => {
            const id = action.payload;
            state.toasts = state.toasts.filter((toast) => toast.id !== id);
        },
        setExpandedClusters: (state, action) => {
            state.expandedClusters = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { showToast, handleCloseToast, setIsListening, setToasts, setExpandedClusters } = toastsSlice.actions;

export default toastsSlice.reducer