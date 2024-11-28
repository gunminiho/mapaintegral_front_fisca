import { createRoot } from 'react-dom/client'
import store from './redux/store/store';
import { Provider } from 'react-redux';
import './index.css'
import ToastComponent from './Components/Popups/ToastComponent.jsx';
import AppRouter from './Router/AppRouter.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastComponent />
    <AppRouter />
  </Provider>
)
