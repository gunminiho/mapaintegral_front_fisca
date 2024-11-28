/*import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Usaremos un icono de close para el botón de cerrar

const Modal = ({ isOpen, onClose, title, children }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[1000]">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-5 border-b rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h3>
                    <button
                        className="text-gray-400 hover:text-gray-900"
                        onClick={onClose}
                    >
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                <div className="flex justify-end items-center p-4 border-t">
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;*/

import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Modal = ({ isOpen, onClose, title, children, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    onSubmit(); // Llamar a la función de envío
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {title}
            </h3>
            <button
              className="text-gray-400 hover:text-gray-900"
              onClick={onClose}
              type="button"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
          <div className="flex justify-end items-center p-4 border-t">
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 ${onSubmit ? "visible": "invisible"}`}
            >
              Guardar
            </button>
            <button
              type="button"
              className="px-4 py-2 ml-2 text-gray-700"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

