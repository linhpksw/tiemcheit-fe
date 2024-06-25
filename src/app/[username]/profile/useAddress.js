'use client';
import { useState } from 'react';
import { robustFetch } from '@/helpers';

const useAddress = (initialAddresses) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [addresses, setAddresses] = useState(initialAddresses);

    const setDefaultAddress = (index) => {
        const updatedAddresses = addresses.map((address, idx) => ({
            ...address,
            isDefault: idx === index,
        }));
        setAddresses(updatedAddresses);
        updateDefaultAddressOnServer(updatedAddresses); // function to send update to server
    };

    const updateDefaultAddressOnServer = async (updatedAddresses) => {
        const username = 'username'; // You would replace this with actual username
        try {
            const response = await fetch(`${BASE_URL}/${username}/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addresses: updatedAddresses }),
            });
            const data = await response.json();
            console.log(data); // Log the server response
        } catch (error) {
            console.error('Failed to update address', error);
        }
    };

    return { addresses, setDefaultAddress };
};

export default useAddress;
