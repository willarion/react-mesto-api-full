import { apiSettings } from './constants';
import api from '../utils/api';


const BASE_URL = apiSettings.baseUrl;

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; ; ) AppleWebKit/ (KHTML, like Gecko) Chrome/ Mobile Safari/; Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1; Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
    },
    body: JSON.stringify({password, email})
  })
  .then((res) => {
    try {
      if (res.status === 200){
        return res.json();
      }
    } catch(e){
      return (e)
    }
  })
  .then((res) => {
    return res;
  })
  .catch((err) => console.log(err));
}; 

export const login = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; ; ) AppleWebKit/ (KHTML, like Gecko) Chrome/ Mobile Safari/; Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1; Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
    },
    body: JSON.stringify({"password": password, "email": email})
  })
  .then(res => res.json())
  .then((data) => {
    if (data.token){
      localStorage.setItem('jwt', data.token);

      return data;
    }
  })
  .catch(err => console.log(err))
}; 

export const getContent = (token) => {
 return Promise.all([
    api.getUserInfo(token), 
    api.getCardList(token)
  ]);
}