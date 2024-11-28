import L from 'leaflet';
import movilIconUrl from "../../assets/img/movil-libre.svg";
import serenoIconUrl from "../../assets/img/sereno.svg";
import MotoMeta from "../../assets/img/Moto Meta.svg";
import ambulanceIconUrl from "../../assets/img/ambulance.svg";
import meta from "../../assets/img/movil-meta.svg";
import unknownIconUrl from "../../assets/img/unknown.svg";
import MotoLibre from "../../assets/img/Moto Libre.svg";
import jefedecampoUrl from "../../assets/img/jefecampo.svg"
import subgerenteIcon from "../../assets/img/subgerente.svg"

// Elimina la configuración por defecto para evitar problemas con Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;

// función para devolver un icono basado en tipo de unidad
const getIcon = (position) => {
    const iconos = [
        {
            iconUrl: MotoMeta,
            size: [45, 45],
            label: 'Moto Meta',
        }, //      0   // MOTOS - META
        {
            iconUrl: meta,
            size: [40, 40],
            label: 'Movil Meta',
        }, //      1    // MOVIL META
        {
            iconUrl: movilIconUrl,
            size: [40, 40],
            label: 'Movil Libre',
        },   //      2   // MOVIL Libre
        {
            iconUrl: MotoLibre,
            size: [50, 50],
            label: 'Moto Libre',
        },   //     3   // MOTOS Libres
        {
            iconUrl: unknownIconUrl,
            size: [45, 45],
            label: 'Desconocido',
        },  //     4   // NO USAR ESTE ESPACIO NO PARECE EN LA LISTA
        {
            iconUrl: ambulanceIconUrl,
            size: [30, 30],
            label: 'Ambulancia',
        },//     5   // AMBULANCIAS o RESCATE
        {
            iconUrl: subgerenteIcon,
            size: [30, 30],
            label: 'Subgerente',
        },   //    6   // BICICLETA - SUBGERENTE
        {
            iconUrl: serenoIconUrl,
            size: [27, 27],
            label: 'Sereno a Pie',
        },    //    7   // SERENO PIE
        {
            iconUrl: jefedecampoUrl,
            size: [30, 30],
            label: 'Supervisor',
        }, //      8    SUPERVISORES
    ];

    return iconos[position];
};

export default getIcon;
