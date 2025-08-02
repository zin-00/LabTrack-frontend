export const useApiUrl = () => {

  const api = (path = '') => {
    return `http://127.0.0.1:8000/api${path}`;
  };

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