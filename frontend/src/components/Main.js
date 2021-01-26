import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';


function Main(props) {

  //данные пользователя
  const currentUser = React.useContext(CurrentUserContext);


  return (
    <main>
      <section className="profile">
        <div className="profile__description">
          <button className="profile__edit-avatar-btn" onClick={props.onEditAvatar}>
            <div className="profile__edit-btn-overlay"></div>
            <img src={currentUser.avatar} alt="аватар" className="profile__avatar" />
          </button>
          <div className="profile__info">
            <h1 className="profile__name">{currentUser.name}</h1>
            <p className="profile__bio">{currentUser.about}</p>
            <button type="button" className="profile__edit-btn" onClick={props.onEditProfile} />
          </div>
        </div>
        <button type="button" className="profile__add-btn" onClick={props.onAddPlace} />
      </section>

      <section className="elements">
        <ul className="elements__list">
          {props.cards.map((card) => (
            <Card onCardDelete={props.onCardDelete} onCardLike={props.onCardLike} card={card} key={card._id} onCardClick={props.onCardClick} />
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Main;