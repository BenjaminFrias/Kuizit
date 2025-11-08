import { Outlet, Navigate } from 'react-router';

type ProtectedRoutesProps = {
	canAccess: boolean;
	redirectTo?: string;
};

export default function ProtectedRoutes({
	canAccess,
	redirectTo = '/input',
}: ProtectedRoutesProps) {
	return canAccess ? <Outlet /> : <Navigate to={redirectTo} />;
}
