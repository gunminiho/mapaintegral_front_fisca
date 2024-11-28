import { useSelector } from "react-redux";
import Hide from "../../assets/iconos/hide.svg";
import Show from "../../assets/iconos/show.svg";
import { useState } from "react";


const Conteo = () => {

    const [hideUnits, setHideUnits] = useState(false);
    const { resumen } = useSelector(state => state.units);

    const totalActivos = (resumen?.PERSONA?.activo || 0) + (resumen?.AUTOMOVIL?.activo || 0) + (resumen?.MOTO?.activo || 0) + (resumen?.AMBULANCIA?.activo || 0);
    const totalInactivos = (resumen?.PERSONA?.inactivo || 0) + (resumen?.AUTOMOVIL?.inactivo || 0) + (resumen?.MOTO?.inactivo || 0) + (resumen?.AMBULANCIA?.inactivo || 0);

    const handleHideUnits = () => {
        setHideUnits(!hideUnits);
    }

    return (
        <>
            <div className="absolute bottom-6 left-1 bg-white p-2 shadow-lg rounded-lg z-[1100] font-bold transition-all">
                <div className="flex items-center justify-between gap-20" onClick={handleHideUnits}>
                    <h2 className="font-bold text-black">Unidades en campo</h2>
                    <button className="flex flex-col items-center justify-center"><img src={hideUnits ? Hide : Show} className="size-7" /></button>
                </div>
                <div className={`${hideUnits ? "" : "hidden"}`}>
                    <div className="max-h-[400px] overflow-y-auto w-[fit-content] min-h-[fit-content]">
                        <table className={`w-[fit-content] bg-white border border-gray-300 rounded-lg`}>
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="py-2 px-4 text-left font-semibold">Unidad</th>
                                    <th className="py-2 px-4 text-left font-semibold">Cantidad</th>
                                    <th className="py-2 px-4 text-left font-semibold">Estado</th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Serenos</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.PERSONA?.activo}</td>
                                    <td className="py-2 px-4 text-blue-700">Activos</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Orion</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.AUTOMOVIL?.activo}</td>
                                    <td className="py-2 px-4 text-blue-700">Activos</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Hermes</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.MOTO?.activo}</td>
                                    <td className="py-2 px-4 text-blue-700">Activos</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Rescate</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.AMBULANCIA?.activo}</td>
                                    <td className="py-2 px-4 text-blue-700">Activas</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Serenos</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.PERSONA?.inactivo}</td>
                                    <td className="py-2 px-4 text-red-500">Inactivos</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Orion</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.AUTOMOVIL?.inactivo}</td>
                                    <td className="py-2 px-4 text-red-500">Inactivos</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Hermes</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.MOTO?.inactivo}</td>
                                    <td className="py-2 px-4 text-red-500">Inactivos</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-2 px-4 text-gray-700">Rescate</td>
                                    <td className="py-2 px-4 text-gray-700">{resumen?.AMBULANCIA?.inactivo}</td>
                                    <td className="py-2 px-4 text-red-500">Inactivos</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <table className="w-full bg-white border border-gray-300 rounded-lg">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="py-1 px-2 text-left text-xs font-semibold">Estado</th>
                                    <th className="py-1 px-2 text-center text-xs font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="py-1 px-2 text-left text-xs text-gray-700">Total Activos</td>
                                    <td className="py-1 px-2 text-center text-xs text-blue-700">{totalActivos}</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-1 px-2 text-left text-xs text-gray-700">Total Inactivos</td>
                                    <td className="py-1 px-2 text-center text-xs text-red-500">{totalInactivos}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );

};

export default Conteo;