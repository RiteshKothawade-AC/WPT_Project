
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    const userRole = String(user.role || '').toLowerCase();
    const expectedRole = String(requiredRole || '').toLowerCase();

    if (userRole !== expectedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
