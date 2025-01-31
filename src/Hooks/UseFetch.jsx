import axios from 'axios'
import { useDispatch } from 'react-redux';
import CustomSwal from '../Components/helpers/swalConfig';
import { logout, moduleLoading } from '../redux/slices/AuthSlice';

function useFetch() {
  const dispatch = useDispatch()

  const handleAuthError = (error, lazy) => {
    if (error.response && error.response.status === 401 && !lazy) {
      CustomSwal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
        didClose: () => {
          dispatch(logout())
        }
      })
      return { isAuthError: true, message: 'Sesión expirada' }
    }
    return { isAuthError: false }
  }

  const getData = async (url, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {

      const authError = handleAuthError(error, lazy)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }

  }

  const postData = async (url, data, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      const authError = handleAuthError(error)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }
  }


  return { getData, postData }
}

export default useFetch