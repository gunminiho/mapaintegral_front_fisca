import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Hide from "../../assets/iconos/hide.svg";
import Show from "../../assets/iconos/show.svg";
const ConteoCelular = () => {
    const [hideDetails, setHideDetails] = useState(false);
    const { celulares } = useSelector((state) => state.celulares);
    // Función para determinar si un celular está activo
    const isActive = (celular) => {
        const { inactiveTime } = celular;
        if (!inactiveTime) return true;
        const { value, type } = inactiveTime;
        if (!value || !type) return true;
        // Obtener la hora actual en minutos
        const currentTimeInMinutes = new Date().getHours() * 60 + new Date().getMinutes();
        // Calcular el tiempo de inactividad en minutos
        let inactiveTimeInMinutes = 0;
        if (type.toLowerCase() === "days") {
            inactiveTimeInMinutes = value * 24 * 60;
        } else if (type.toLowerCase() === "hours") {
            inactiveTimeInMinutes = value * 60;
        } else if (type.toLowerCase() === "minutes") {
            inactiveTimeInMinutes = value;
        }
        // Verificar si la diferencia entre la hora actual y el tiempo de inactividad es menor a 5minutos
        const timeDifference = Math.abs(currentTimeInMinutes - inactiveTimeInMinutes);
        // Si la diferencia es menor a 5 minutos, consideramos que el celular está activo
        if (timeDifference <= 5) {
            return true;
        }
        return inactiveTimeInMinutes < 0;
    };
    // Memorizar cálculos
    const { resumen_celulares, totalPorTurno } = useMemo(() => {
        const turnos = ["Mañana", "Tarde", "Noche"];
        const resumen = { activos: 0, inactivos: 0 };
        const totales = {};
        turnos.forEach((turno) => {
            const celularesTurno = celulares.filter(
                (celular) => celular.turno.toLowerCase() === turno.toLowerCase()
            );
            const activos = celularesTurno.filter(isActive).length;
            const inactivos = celularesTurno.length - activos;
            resumen.activos += activos;
            resumen.inactivos += inactivos;
            totales[turno] = { activos, inactivos };
        });
        return { resumen_celulares: resumen, totalPorTurno: totales };
    }, [celulares]);
    const handleToggleDetails = () => setHideDetails(!hideDetails);
    return (
        <div className="absolute bottom-20 left-1 bg-white p-2 shadow-lg rounded-lg z-[999] font-bold transition-all">
            <div className="flex items-center justify-between gap-20" onClick={handleToggleDetails}>
                <h2 className="font-bold text-black">Celulares en campo</h2>
                <button className="flex flex-col items-center justify-center">
                    <img src={hideDetails ? Hide : Show} className="size-7" />
                </button>
            </div>
            {hideDetails && (
                <div>
                    <div className="mt-4">
                        <table className="w-full bg-white border border-gray-300 rounded-lg text-xs">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="py-2 px-4 text-left font-semibold">Turno</th>
                                    <th className="py-2 px-4 text-center font-semibold">Activos</th>
                                    <th className="py-2 px-4 text-center font-semibold">Inactivos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(totalPorTurno).map(([turno, { activos, inactivos }]) => (
                                    <tr key={turno} className="border-t">
                                        <td className="py-2 px-4 text-gray-700">{turno}</td>
                                        <td className="py-2 px-4 text-center text-blue-700">{activos}</td>
                                        <td className="py-2 px-4 text-center text-red-500">{inactivos}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <table className="w-full bg-white border border-gray-300 rounded-lg text-xs">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="py-2 px-4 text-left font-semibold">Estado</th>
                                    <th className="py-2 px-4 text-center font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Activos</td>
                                    <td className="py-2 px-4 text-center text-blue-700">{resumen_celulares.activos}</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Inactivos</td>
                                    <td className="py-2 px-4 text-center text-red-500">{resumen_celulares.inactivos}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ConteoCelular;