import { useState, useEffect } from 'react';

// Hook placeholder for fetching and managing functional units
export const useFunctionalUnits = () => {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        // TODO: llamar al servicio para obtener UFs
    }, []);

    return { units };
};
