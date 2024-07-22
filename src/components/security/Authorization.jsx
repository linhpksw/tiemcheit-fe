'use client';
import { useAuthorization } from '@/hooks';
import { useRouter, usePathname } from 'next/navigation';

const Authorization = ({
    allowedRoles = null,
    notAllowedRoles = null,
    children,
    username = null,
}) => {
    const router = useRouter();
    const pathname = usePathname()

    const { checkAccess } = useAuthorization(username);
    const canAccess = checkAccess({ allowedRoles, notAllowedRoles });

    if (!canAccess) {
        const loginUrl = `/auth/login?redirectTo=${encodeURIComponent(pathname)}`;
        setTimeout(() => {
            router.push(loginUrl);
        }, 0);
    }

    return canAccess ? <>{children}</> : null;
};

export default Authorization;
