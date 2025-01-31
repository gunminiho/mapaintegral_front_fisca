import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../Socket/socket";
import { Marker, Popup, useMap } from "react-leaflet";
import celular from "../../assets/iconos/celular.png";
import shadow from "../../assets/iconos/marker-shadow.png";
import { CloseAllPopups, formatearFecha } from "../helpers/Functions";
import { useDispatch, useSelector } from "react-redux";
import {
  setCelulares,
  setCelularesFiltered,
} from "../../redux/slices/CelularesSlice";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";
import CustomModal from "../Modal/CustomModal";
import {
  duration,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { showToast } from "../../redux/slices/toastsSlice";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useParams } from "react-router-dom";
import UseCelulares from "../../Hooks/UseCelulares";
import useFetch from "../../Hooks/UseFetch";

const Celulares = ({ itemsFiltros, setItemsFiltros }) => {
  const dispatch = useDispatch();
  const map = useMap();
  const clusterRef = useRef(null);
  const markersRef = useRef([]);
  const { celulares, celularFollowed, celularIsFollowed, celularesFiltered } =
    useSelector((state) => state.celulares);
  const [isOpenModal, setisOpenModal] = useState(false);
  const [SelectedMarkers, setSelectedMarkers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const arrFiltros =
      itemsFiltros.find((item) => item.id === "celulares")?.items || [];

    // Calcular el estado para cada celular antes del filtrado
    const celularesConEstado = celulares.map((celular) => {
      const { inactiveTime } = celular;
      const isInactive =
        (inactiveTime.type === "minutes" && inactiveTime.value >= 1) ||
        (inactiveTime.type === "hours" && inactiveTime.value >= 1) ||
        (inactiveTime.type === "days" && inactiveTime.value >= 1);

      return {
        ...celular,
        estado: isInactive ? "Inactivo" : "Activo",
      };
    });

    // Filtrar las celulares según los filtros
    const filtered = arrFiltros.every((filtro) => filtro.checked)
      ? celularesConEstado // Si todos los filtros están activados, mostrar todas las celulares
      : celularesConEstado.filter((celular) =>
          arrFiltros.every(({ checked, atributo, valorFiltro }) => {
            if (checked) return true;

            if (atributo === "estado") {
              // Evaluar si el estado es Activo o Inactivo
              return !valorFiltro.includes(celular[atributo]);
            }

            const value = celular[atributo]?.toLowerCase?.() || "";
            return !valorFiltro.map((v) => v.toLowerCase()).includes(value);
          })
        );

    dispatch(setCelularesFiltered(filtered));
  }, [celulares, itemsFiltros]);

  useEffect(() => {
    const checkAndMoveToMarker = () => {
      if (celularIsFollowed || id) {
        const CeludarSeguido = celulares.find(
          (cel) => cel.id == celularFollowed || cel.id == id
        );

        if (CeludarSeguido) {
          // Encontrar el marcador existente
          const marker = markersRef.current[CeludarSeguido.id];

          if (marker) {
            CloseAllPopups(map);
            // Mover el mapa a la ubicación del marcador
        
            
            map.flyTo([marker._latlng.lat, marker._latlng.lng], 18, {
              animate: true,
              duration: 0.1,
            });


            setTimeout(() => {
              // Verificar si el marcador está dentro de un clúster con la propiedad '_icon'
              if (marker._icon === undefined || marker._icon === null) {
                // Expande el clúster para mostrar los marcadores individuales
                if (marker?.__parent && typeof marker.__parent.spiderfy === "function") {
                    marker.__parent.spiderfy();
                  } else {
                    map.flyTo([marker._latlng.lat, marker._latlng.lng], 13, {
                        animate: true,
                        duration: 0.1,
                      });
                      return
                  }
              }

              // Abrir el popup del marcador
              marker.openPopup();
            }, 600);
          }
        }
      }
    };

    checkAndMoveToMarker();
  }, [celularIsFollowed, celularFollowed, celulares, map]);

  UseCelulares();

  return (
    <>
      <MarkerClusterGroup
        onClick={async (e) => {
          e.layer.unspiderfy();

          const markers = e.layer.getAllChildMarkers();

          if (markers.length > 0) {
            const bounds = L.latLngBounds(
              markers.map((marker) => marker.getLatLng())
            );
            e.layer._map.fitBounds(bounds); // Asegúrate de tener una referencia al mapa
            if (e.layer._zoom === 18) {
              setisOpenModal(true);
              setSelectedMarkers(markers);
            }
          }
        }}
        maxClusterRadius={30}
        zoomToBoundsOnClick={false}
        ref={clusterRef}
      >
        {celularesFiltered &&
          celularesFiltered.map((punto, index) => {
            const latitud = punto.position[0].latitude;
            const longitud = punto.position[0].longitude;

            const {
              id,
              date,
              estado,
              nombres,
              apellidos,
              dni,
              telefono,
              turno,
              superior,
              batteryLevel,
              gpsEnabled,
            } = punto;
            const pos = [latitud, longitud];
            const shadowColor = estado === "Activo" ? "#04d62e" : "#ed0202";
            const gray =
              estado === "Activo"
                ? "width: 100%; height: 100%;"
                : "width: 100%; height: 100%;  filter: grayscale(100%);";
            const notGps = gpsEnabled == "false" || gpsEnabled == null ? "notGps" : "";
            const icon = L.divIcon({
              className: "custom-marker",
              html: `
                          <div class="${notGps}" style="
                            position: relative;
                            width: 30px;
                            height: 35px;
                          "
                          >
                            <img src="${celular}" alt="icon" style="${gray}" />
                            <div style="
                              position: absolute;
                              width: 50%;
                              height: 50%;
                              background-color: ${shadowColor};
                              border-radius: 50%;
                              filter: blur(10px);
                              z-index: -1;
                              top: 10px;
                              left: 10px;
                            "></div>
                          </div>
                        `,
              iconSize: [30, 35],
              iconAnchor: [15, 30],
              popupAnchor: [0, -30],
            });

            return (
              <Marker
                key={id}
                position={pos}
                icon={icon}
                attribution={punto}
                ref={(ref) => (markersRef.current[punto.id] = ref)}
              >
                <Popup on>
                  <span className="text-left max-w-xs">
                    <p className="text-sm text-gray-600">
                      <strong>Nombre:</strong>{" "}
                      {nombres && apellidos
                        ? `${nombres} ${apellidos}`
                        : "No disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Teléfono:</strong> {telefono || "No disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>DNI:</strong> {dni || "No disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Superior:</strong> {superior || "No disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Turno:</strong> {turno || "No disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Estado:</strong> {estado || "No disponible"}
                    </p> 
                    <p className="text-sm text-gray-600">
                      <strong>Bateria:</strong>{" "}
                      {batteryLevel ? batteryLevel + "%" : "No disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>GPS:</strong> {gpsEnabled || "No disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Última actualización:</strong>{" "}
                      {formatearFecha(date) || "No disponible"}
                    </p>
                  
                  </span>
                </Popup>
              </Marker>
            );
          })}
      </MarkerClusterGroup>

      {/* Modal info puntos */}

      <CustomModal
        Open={isOpenModal}
        handleClose={() => {
          setisOpenModal(false);
        }}
      >
        <div className="flex items-center mb-2">
          <h1 className="text-lg font-bold fl">Lista de puntos</h1>
        </div>
        <div className="overflow-x-auto pb-2">
          <Table size="small">
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell
                  style={{ backgroundColor: "#e5e7eb" }}
                  className="sticky left-0 bg-gray-200 z-10"
                >
                  Nombre
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  Telefono
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  DNI
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  Superior
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  Turno
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  Estado
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  Fecha
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  Bateria
                </TableCell>
                <TableCell style={{ backgroundColor: "#e5e7eb" }}>
                  GPS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SelectedMarkers?.map((punto, index) => {
                const {
                  id,
                  nombres,
                  apellidos,
                  dni,
                  telefono,
                  turno,
                  superior,
                } = punto.options.attribution;
                const fechaDate = celularesFiltered.find(
                  (item) => item.id === id
                );

                return (
                  <TableRow key={index}>
                    <TableCell className="text-nowrap sticky left-0 bg-white">
                      {nombres && apellidos ? `${nombres} ${apellidos}` : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {" "}
                      {telefono || "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">{dni || "-"}</TableCell>
                    <TableCell className="text-nowrap">
                      {superior || "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {turno || "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {fechaDate?.estado || "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {formatearFecha(fechaDate?.date) || "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {fechaDate?.batteryLevel ? fechaDate?.batteryLevel + "%"  : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {fechaDate?.gpsEnabled || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CustomModal>
    </>
  );
};

export default Celulares;