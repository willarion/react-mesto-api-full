import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card(props) {

  const currentUser = React.useContext(CurrentUserContext);
  
  const isOwned = props.card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = (
    `element__delete-btn ${isOwned 
    && 'element__delete-btn_visible'}`
  );

  const isLiked = props.card.likes.some(i => i._id === currentUser._id);

  const cardLikeButtonClassName = (
    `element__like ${isLiked 
    && 'element__like_is-liked'}`
  );


  function handleClick() {
    props.onCardClick(props.card);
  }  

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleCardDelete() {
    props.onCardDelete(props.card);
  }


  return (
    <li className="card-element">
      <div className="element">
        <button type="button" className={cardDeleteButtonClassName} onClick={handleCardDelete} />
        <img src={props.card.link} alt={props.card.name} className="element__image" onClick={handleClick} />
        <div className="element__caption">
          <p className="element__text">{props.card.name} </p>
          <div className="element__like-display">
            <button type="submit" className={cardLikeButtonClassName} onClick={handleLikeClick} />
            <p className="element__like-counter">{props.card.likes.length}</p>
          </div>
        </div>
      </div>
    </li>
  )
} 


export default Card;