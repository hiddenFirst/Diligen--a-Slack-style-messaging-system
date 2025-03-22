import {Navigate, Outlet} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 *
 * @param {object} props - prop
 * @param {boolean} [props.isAuthenticated] - boolean
 * @returns {object} relocated
 */
export default function AuthenticatedRoute({isAuthenticated}) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

AuthenticatedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};
