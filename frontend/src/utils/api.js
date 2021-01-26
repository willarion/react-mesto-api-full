import {apiSettings} from './constants'

class Api {
  
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._authorization = options.headers.authorization; 
    this._contentType = options.headers["Content-Type"];
  }

  _handleOriginalResponse(res) {
    
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`
        }
    })
    .then(this._handleOriginalResponse);
  }

  getCardList(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`
        }
    })
    .then(this._handleOriginalResponse);
  }  

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      //putCardLike

      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'PUT',
        headers: {
          authorization: this._authorization
          }
      })
      .then(this._handleOriginalResponse);
    }
    else {
      //deleteCardLike

      return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
        method: 'DELETE',
        headers: {
          authorization: this._authorization
          }
      })
      .then(this._handleOriginalResponse);
    }
  }
  
  addNewCard(cardInfo) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: this._authorization,
        'Content-Type': this._contentType
        },
      body: JSON.stringify(cardInfo)
    })
    .then(this._handleOriginalResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: this._authorization
        }
    })
    .then(this._handleOriginalResponse);
  }

  setUserInfo(userInfoObj) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._authorization,
        'Content-Type': this._contentType,
      },
      body: JSON.stringify(userInfoObj)
    })
    .then(this._handleOriginalResponse);
  }

  setUserAvatar(avatarLink) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._authorization,
        'Content-Type': this._contentType
        },
      body: JSON.stringify(avatarLink)
    })
    .then(this._handleOriginalResponse);
  }
}

const api = new Api(apiSettings);

export default api;  



 