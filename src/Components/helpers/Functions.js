
export const getColorByIndex = (index) => {
    const colors = ['green', 'purple', 'blue', 'red', 'grey', 'black'];
    return colors[index % colors.length]; // Repetimos colores si hay más jurisdicciones que colores
};

export function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);

    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const anio = fechaObj.getFullYear();

    const horas = String(fechaObj.getHours()).padStart(2, '0');
    const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
    const segundos = String(fechaObj.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
}

export function filterAndSortData(listaCelulares, searchTerm, orderBy, orderDirection, filterFunction) {
    return [...listaCelulares]
        .filter((celular) => filterFunction(celular, searchTerm))
        .sort((a, b) => {
            // Separar orderBy por puntos para acceder a propiedades anidadas
            const orderByKeys = orderBy.split('.');

            // Acceder a las propiedades anidadas
            const aValue = orderByKeys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, a);
            const bValue = orderByKeys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, b);

            // Comprobar el orden
            if (orderDirection === 'asc') {
                return aValue < bValue ? -1 : 1;
            }
            return aValue > bValue ? -1 : 1;
        });
}

export function CloseAllPopups(map) {
    map.eachLayer((layer) => {
        if (layer.getPopup && layer.getPopup()) {
            layer.closePopup();
        }
    });
}


export const calculateInactiveTime = (celularDate) => {
    // Validar si las fechas son válidas
    const celularTime = new Date(celularDate);
    const today = new Date();
    if (isNaN(celularTime)) {
        throw new Error('Fechas inválidas');
    }

    const MILLISECONDS_IN_A_MINUTE = 1000 * 60;
    const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * 60;
    const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * 24;

    const timeDifference = today - celularTime;

    const days = Math.floor(timeDifference / MILLISECONDS_IN_A_DAY);
    const hours = Math.floor((timeDifference % MILLISECONDS_IN_A_DAY) / MILLISECONDS_IN_AN_HOUR);
    const minutes = Math.floor((timeDifference % MILLISECONDS_IN_AN_HOUR) / MILLISECONDS_IN_A_MINUTE);

    if (days > 0) {
        return { type: 'days', value: days, label: `${days} ${days === 1 ? 'día' : 'días'}`, difference: timeDifference };
    } else if (hours > 0) {
        return { type: 'hours', value: hours, label: `${hours} ${hours === 1 ? 'hora' : 'horas'}`, difference: timeDifference };
    } else {
        return { type: 'minutes', value: minutes, label: `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`, difference: timeDifference };
    }
};

export function CheckIsInTurn(date) {    
    const now = new Date();
    const dia = new Date(date); // Asegúrate de que 'date' esté en un formato adecuado
    const hours = dia.getHours();
    const nowHours = now.getHours();
    
    let isInTurno = false;
    
    // Verifica el turno actual basado en 'nowHours'
    if (nowHours >= 7 && nowHours < 15) { // Turno mañana (7am - 3pm)
        if (hours >= 7 && hours < 15) {
            isInTurno = true;
        }
    } else if (nowHours >= 15 && nowHours < 23) { // Turno tarde (3pm - 11pm)
        if (hours >= 15 && hours < 23) {
            isInTurno = true;
        }
    } else if (nowHours >= 23 || nowHours < 7) { // Turno noche (11pm - 7am)
        if (hours >= 23 || hours < 7) {
            isInTurno = true;
        }
    }

    return isInTurno;
}

export function FilterWithTurn(data) {
    return data.filter(celular => {
        // Filtrar por turno nuevamente si es necesario
        const celularDate = new Date(celular.date);
        const hours = celularDate.getHours();
        return (
            (hours >= 7 && hours < 15) || // Turno mañana
            (hours >= 15 && hours < 23) || // Turno tarde
            (hours >= 23 || hours < 7) // Turno noche
        );
    })
}


export function normalizarNombre(nombre) {
    // Convertir a minúsculas y eliminar palabras no relevantes
    return nombre
        .toLowerCase() // Convertir a minúsculas
        .trim(); // Eliminar espacios al principio y al final
}

export function validarNombres(nombre1, nombre2) {
    // Normalizamos ambos nombres
    const nombre1Normalizado = normalizarNombre(nombre1).split(' ');
    const nombre2Normalizado = normalizarNombre(nombre2).split(' ').slice(2);

    const sonIguales = nombre1Normalizado.every(palabra => nombre2Normalizado.includes(palabra))
    const sonIguales2 = nombre2Normalizado.every(palabra => nombre1Normalizado.includes(palabra))

    // Comparar los nombres normalizados
    return sonIguales || sonIguales2;
}