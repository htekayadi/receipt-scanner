import axios from 'axios';
const TIMEOUT = 60000;

function apiClient(url = '', httpMethod = 'get', params = {}, data = {}, headers = {}) {
  return axios({
    url,
    timeout: TIMEOUT,
    method: httpMethod,
    data,
    headers,
    params,
  })
  .catch((error) => {
    if (!error.response) {
      throw new Error('Network Error');
    } else {
      throw error;
    }
  });
}

export default apiClient;
