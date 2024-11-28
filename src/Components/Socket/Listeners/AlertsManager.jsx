import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Fab } from '@mui/material';
import PlayIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded';
import PauseIcon from '@mui/icons-material/Pause';
import { handleCloseToast, setExpandedClusters, setIsListening, setToasts, showToast } from '../../../redux/slices/toastsSlice';
import { socket } from '../socket';
import axios from 'axios';
import header from '../../helpers/postHeaders';
import notification from "../../../assets/sounds/notification.mp3";
import notification_error from "../../../assets/sounds/notification-error.mp3";
import { setIsFollowed, setIssiFollowed } from '../../../redux/slices/unitsReducer';
import { setCelularFollowed, setIsFollowedCelular } from '../../../redux/slices/CelularesSlice';
import ReiniciarVigilancia from '../../Forms/Alertas/ReiniciarVigilancia';
import { useMap } from 'react-leaflet';
import { CloseAllPopups } from '../../helpers/Functions';


const AlertsManager = () => {
  const dispatch = useDispatch();
  const map = useMap()
  const { toasts, isListening } = useSelector((state) => state.toasts);
  const { Jurisdicciones, Subsectores } = useSelector((state) => state.areas);

  const toastsRef = useRef(toasts);


  const IDS_TIPO_REAS = [
    {
      id: 1,
      name: "Circulo",
      idArea: 0,
    },
    {
      id: 2,
      name: "Cuadrado",
      idArea: 1,
    },
    {
      id: 3,
      name: "Subsector",
      idArea: 2,
    },
    {
      id: 4,
      name: "Sector",
      idArea: 3,
    }
  ]
  const CleanVigilancia = () => {
    axios.delete(`${import.meta.env.VITE_APP_ENDPOINT}/issis/delete/`, {}, header())
      .then(res => {

        dispatch(setToasts([]));
        dispatch(setExpandedClusters({}));
        dispatch(showToast({
          message: res.data.message,
          type: "success",
          duration: 2000
        }))
        dispatch(setIsListening(false))
      })
      .catch(error => {
        console.error(error)
        if (error.status === 404) {
          dispatch(showToast({
            message: "No existen ISSI(s) para borrar",
            type: "error",
            duration: 2000
          }))

        }
        else {
          dispatch(showToast({
            message: error.message,
            type: "error",
            duration: 2000
          }))
        }
      })
  }

  const onFollowPoint = (id) => {
    if (id.length <= 5) {
      dispatch(setIssiFollowed(id));
      dispatch(setIsFollowed(true));
      setTimeout(() => {
        dispatch(setIsFollowed(false));
      }, 5000);
    } else {
      dispatch(setCelularFollowed(id));
      dispatch(setIsFollowedCelular(true));
      setTimeout(() => {
        dispatch(setIsFollowedCelular(false));
      }, 5000);
    }

  }

  const onFollowArea = (obj) => {
    CloseAllPopups(map)
    dispatch(setIsFollowed(false));
    dispatch(setIsFollowedCelular(false));

    if (obj.options.tipo === 0 || obj.options.tipo === 1) {

      map.flyTo([obj.point[1], obj.point[0]], 18, {
        animate: true,
        duration: 0.5
      });
    } else if (obj.options.tipo === 2) {      
      const area = Subsectores.find((objeto) => objeto.id === obj.options.valor)
      
      const latLngBounds = area.puntos.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);

      map.flyToBounds(latLngBounds, {
        animate: true,
        duration: 0.5
      })
    } else if (obj.options.tipo === 3) {
      const area = Jurisdicciones.features.find((objeto) => objeto.id === obj.options.valor)

      const latLngBounds = area.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);
      map.flyToBounds(latLngBounds, {
        animate: true,
        duration: 0.5
      })
    }
  }

  let isPlayingSound = false; // Bandera para verificar si el sonido ya está reproduciéndose

  const playSound = (soundFile) => {
    if (!isPlayingSound) {  // Solo reproduce si no está sonando otro
      const alertSound = new Audio(soundFile);

      isPlayingSound = true; // Marca que el sonido está en ejecución
      alertSound.play();

      // Cuando termina el sonido, reinicia la bandera
      setTimeout(() => {
        isPlayingSound = false;
      }, 350);
    }
  };

  const VerifyAlertsExist = (arr) => {
    let delay = 0;

    arr.forEach((obj, index) => {
      setTimeout(() => {
        const toastArr = toastsRef.current;
        const existingToast = toastArr.find((toast) => toast.id === obj.issi);
        const tipo_name = IDS_TIPO_REAS.find(tipo => tipo.idArea === obj.options.tipo).name

        const TitleMsg = `${tipo_name} `

        // 1) Si isInside es false, mostrar alerta tipo error
        if (!obj.isInside) {
          if (existingToast && existingToast.type === 'success') {
            // Si ya hay una alerta de tipo success para este issi, eliminarla
            dispatch(handleCloseToast(obj.issi));
          }
          if (!existingToast || existingToast.type !== 'error') {
            // Si no hay alerta o la existente no es de tipo error, crear una nueva alerta de error
            dispatch(showToast({
              id: obj.issi,
              message: obj.message,
              type: 'error',
              duration: null, // La alerta debe persistir
              vertical: 'top',
              horizontal: 'right',
              title: TitleMsg,
              followPoint: () => onFollowPoint(obj.issi),
              followArea: () => onFollowArea(obj),
              cluster: 'vigilancia'
            }));
            playSound(notification_error);
          }
        }

        // 2) Si isInside es true, mostrar alerta tipo success
        if (obj.isInside) {
          if (existingToast && existingToast.type === 'error') {
            // Si hay una alerta de tipo error, eliminarla
            dispatch(handleCloseToast(obj.issi));
          }
          if (!existingToast || existingToast.type !== 'success') {
            // Si no hay alerta o la existente no es de tipo success, crear una nueva alerta de success
            dispatch(showToast({
              id: obj.issi,
              message: obj.message,
              type: 'success',
              duration: null, // La alerta debe persistir hasta que sea eliminada por el servidor
              vertical: 'top',
              horizontal: 'right',
              title: TitleMsg,
              followPoint: () => onFollowPoint(obj.issi),
              followArea: () => onFollowArea(obj),
              cluster: 'vigilancia'
            }));
            playSound(notification);
          }
        }
      }, delay); // Añade el delay acumulado para cada alerta

      delay += arr.length >= 5 ? 0 : 400; // Incrementa el delay para la siguiente alerta (500 ms en este caso)

    });

    const toastArr = toastsRef.current;
    // 3) Si un objeto ha sido eliminado del array del servidor
    toastArr.forEach((toast) => {
      const existsInServer = arr.find((obj) => obj.issi === toast.id);
      if (!existsInServer && toast.type === 'error') {
        // Si la alerta no está en el array del servidor y es de tipo error, eliminarla
        dispatch(handleCloseToast(toast.id));
      }
    });
  };


  const startListening = () => {

    dispatch(setIsListening(true));
  }
  const stopListening = () => {
    dispatch(setToasts([]));
    dispatch(setIsListening(false));
  }


  useEffect(() => {
    toastsRef.current = toasts
  }, [toasts])

  useEffect(() => {
    const handleAlert = (data) => {
      VerifyAlertsExist(data);
    };

    if (isListening) {
      socket.on('alerta', handleAlert);
    }
    else {
      socket.off('alerta', handleAlert);
    }

    return () => {
      socket.off('alerta', handleAlert);
    };
  }, [isListening])


  return (
    <div className="flex flex-col gap-2 absolute bottom-7 right-4">
      {isListening ? (
        <Fab
          variant="extended"
          size="medium"
          color="error"
          onClick={stopListening}
        >
          <PauseIcon sx={{ mr: 1 }} />
          Pausar Vigilancia
        </Fab>
      ) :
        <Fab
          variant="extended"
          size="medium"
          color="success"
          onClick={startListening}
        >
          <PlayIcon sx={{ mr: 1 }} />
          Iniciar Vigilancia
        </Fab>
      }
      <ReiniciarVigilancia
        CleanVigilancia={CleanVigilancia}
      />
    </div>
  )
}

export default AlertsManager