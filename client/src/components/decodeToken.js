import jwt_decode from 'jwt-decode';

const decodeToken = (token) => {
  try {
    return jwt_decode(token);
  } catch (error) {
    console.log('Error decoding token:', error);
    return null;
  }
};

export default decodeToken;