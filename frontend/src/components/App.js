import React from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Main from '../components/Main';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import badTooltipImage from '../images/not-registered.svg';
import goodTooltipImage from '../images/registered.svg';
import api from '../utils/api';
import * as auth from '../utils/auth';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import PopupWithForm from './PopupWithForm';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';


function App() {
  const history = useHistory();

  //авторизация
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  
  //получение страницы пользователя с карточками
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleUserEmail(email) {
    setUserEmail(email);
  }

  React.useEffect(() => { //tokenCheck
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          if (res) {
            api.getCardList(jwt)
              .then((cardsArray) => {
                setCards(cardsArray);
              })
              .catch((err) => {
                console.log(`Ошибка: ${err}`);
              });

            setCurrentUser(res.data);
            handleUserEmail(res.data.email);
            handleLogin();
            history.push('/');
          }
        })
    } 
  }, [history, loggedIn])


  //кнопки Header
  const [urlAdress, setUrlAdress] = React.useState('');
  const [urlName, setUrlName] = React.useState('');
  const [location, setLocation] = React.useState(window.location.pathname);

  const loc = useLocation();

  React.useEffect(() => {
    setLocation(loc.pathname);
  }, [loc]);
  

  React.useEffect(() => {
    if (!loggedIn) {
      return
    } else if (location === '/') {
      setUrlAdress('/sing-in');
      setUrlName('Выйти');
    }
  }, [location, loggedIn]);
  
  React.useEffect(() => {
    if (location === '/sing-up') {
      setUrlAdress('/sing-in');
      setUrlName('Войти');
    } else if (location === '/sing-in') {
      setUrlAdress('/sing-up');
      setUrlName('Регистрация');
    }
  }, [loggedIn, location]);


  function signUp(password, email, resetForm) {
    return auth.register(password, email)
    .then((res) => {
      if (res) {
        handleAuthenticationResult({
          message: 'Вы успешно зарегистрировались!',
          image: goodTooltipImage});
        return res;
      } else {
        console.log(res.status)
        handleAuthenticationResult({
          message: 'Что-то пошло не так! Попробуйте ещё раз!',
          image: badTooltipImage});
      }
      resetForm();
    })
    .then(() => history.push('/sign-in'))
    .catch((e) => console.log(e));
  }


  function signIn(password, email, resetForm) {
    return auth.login(password, email)
    .then((data) => {
      if (!data) {
        handleAuthenticationResult({
          message: 'Что-то пошло не так! Попробуйте ещё раз!',
          image: badTooltipImage});
        return;
      } 
      if (data.token) {

        Promise.all([api.getUserInfo(data.token), api.getCardList(data.token)])
        .then(([userInfoObject, cardsArray]) => {
          setCurrentUser(userInfoObject.data);
          setCards(cardsArray);
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });

        handleUserEmail(email);
        resetForm();
        handleLogin();
        history.push('/');
        
        return;
      }
    })
    .catch((e) => console.log(e));

  }


  function singOut() {
    if (urlName === 'Выйти') {
      localStorage.removeItem('jwt');
      handleUserEmail('');
      history.push('/sing-in');
    } else {
      return;
    }
  }


  //попап результата регистрации
  const [isInfoTooltipPopupOpen, changeInfoTooltipPopupState] = React.useState(false);
  const [infoTooltipMessage, setInfoTooltipMessage] = React.useState('');
  const [infoTooltipImage, setInfoTooltipImage] = React.useState('');

  function handleAuthenticationResult({message, image}) {
    changeInfoTooltipPopupState(true);
    setInfoTooltipMessage(message);
    setInfoTooltipImage(image);
  }

  // //получение страницы пользователя с карточками
  // const [currentUser, setCurrentUser] = React.useState({});
  // const [cards, setCards] = React.useState([]);


  // React.useEffect(() => {
  //   if(!loggedIn) {
  //     return;
  //   } else {

  //     Promise.all([api.getUserInfo(), api.getCardList()])
  //       .then(([userInfoObject, cardsArray]) => {
  //         console.log(userInfoObject);
  //         setCurrentUser(userInfoObject.data);
  //         setCards(cardsArray);
  //       })
  //       .catch((err) => {
  //         console.log(`Ошибка: ${err}`);
  //       });
  //   }
  // }, [loggedIn]);

  
  //открытие и закрытие модалок
  const [isEditProfilePopupOpen, changeEditProfilePopupState] = React.useState(false);
  
  const [isEditAvatarPopupOpen, changeEditAvatarPopupState] = React.useState(false);

  const [isAddPlacePopupOpen, changeAddPlacePopupState] = React.useState(false);

  const emptySelectedCard = 
    {
      link: '#',
      name: ''
    }
  const [selectedCard, setSelectedCard] = React.useState(emptySelectedCard);
  const [isSelectedCardOpen, changeSelectedCardState] = React.useState(false);


  function handleEditProfileClick() {
    changeEditProfilePopupState(true);
  }
  
  function handleEditAvatarClick() {
    changeEditAvatarPopupState(true);
  }
  
  function handleAddPlaceClick() {
    changeAddPlacePopupState(true);
  }

  function handleCardClick(data) {
    setSelectedCard(data);
    changeSelectedCardState(true);
  }

  function closeAllPopups() {
    changeEditProfilePopupState(false);
    changeEditAvatarPopupState(false);
    changeAddPlacePopupState(false);
    setSelectedCard(emptySelectedCard);
    changeSelectedCardState(false);
    changeInfoTooltipPopupState(false);
  }


  //редактирование профиля
  function handleUpdateUser(userInfoObj) {
    api.setUserInfo(userInfoObj)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });

  }

  function handleUpdateAvatar(avatarInfoObj) {
    api.setUserAvatar(avatarInfoObj)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });

  }


  //карточки  
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      
      setCards(newCards);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then((res) => {
      console.log(res);
      const newCards = cards.filter((c) => c._id !== card._id);

      setCards(newCards);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function handleAddPlaceSubmit(cardInfo) {

    api.addNewCard(cardInfo)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    });

  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header 
        email={userEmail} 
        urlAdress={urlAdress}
        urlName={urlName}
        onSingOut={singOut}
        />
          <Switch>

            <Route path="/sing-up">
              <Register 
              onSignUp={signUp} />
            </Route>  

            <Route path="/sing-in">
              <Login 
                onSignIn={signIn} 
              />
            </Route> 

            <ProtectedRoute path="/" loggedIn={loggedIn} component={Main} 
              onEditProfile={handleEditProfileClick} 
              onEditAvatar={handleEditAvatarClick} 
              onAddPlace={handleAddPlaceClick}
              cards={cards} 
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />                 

          </Switch>

          {loggedIn && (
            <>
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} /> 
          
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

            <PopupWithForm modalName="type_delete-confirm" formName="delete-confirm-form" title="Вы уверены?" buttonValue="Да" onClose={closeAllPopups} /> 
            
            <PopupWithForm modalName="type_delete-confirm" formName="delete-confirm-form" title="Вы уверены?" buttonValue="Да" onClose={closeAllPopups} /> 
            
            <ImagePopup card={selectedCard} isOpen={isSelectedCardOpen} onClose={closeAllPopups} />
            </>
          )}

          <InfoTooltip 
               isOpen={isInfoTooltipPopupOpen} 
               onClose={closeAllPopups}
               tooltipImage={infoTooltipImage}
               tooltipMessage={infoTooltipMessage}
              />

          <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
