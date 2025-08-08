export const useApiUrl = () => {

const api = 'http://127.0.0.1:8000/api';

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  return { api, getAuthHeader };
};