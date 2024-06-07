import { useAuthorization } from '@/hooks';
import { Forbidden } from '@/components/security';

const Authorization = ({
    allowedRoles,
    children,
    username,
}) => {
    const { checkAccess } = useAuthorization(username);
    const canAccess = checkAccess({ allowedRoles });


    return canAccess ? <>{children}</> : <Forbidden />;
};

export default Authorization;
