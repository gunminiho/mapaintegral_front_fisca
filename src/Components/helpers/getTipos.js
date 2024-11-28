import axios from ("axios");


const getTiposUnidades = async () => {

    const { data, status } = await axios.get(`${import.meta.env.VITE_APP_ENDPOINT}/tiposunidades`);
    if (status === 200)
        return data
    else
        return null

};


export default getTiposUnidades;