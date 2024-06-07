// components/Authorization.js
import React from 'react';
import { useAuthorization } from '@/hooks';

export const Authorization = ({
    allowedRoles,
    forbiddenFallback = <div>Access Denied</div>,
    children,
}) => {
    const { checkAccess } = useAuthorization();

    const canAccess = checkAccess({ allowedRoles });

    return <>{canAccess ? children : forbiddenFallback}</>;
};
