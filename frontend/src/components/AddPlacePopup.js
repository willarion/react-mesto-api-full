import React from 'react';
import PopupWithForm from './PopupWithForm';


function AddPlacePopup(props) {

  const escape = require('escape-html');

  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleNameChange(evt) {
    setName(escape(evt.target.value));
  }
  function handleLinkChange(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onAddPlace({
      name,
      link
    })
  }

  return (
    <PopupWithForm modalName="type_add-card" formName="add-card-form" title="Новое место" buttonValue="Создать" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}> 
        <label className="modal__input-field">
          <input type="text" name="title" placeholder="Название" className="modal__place-title modal__input-line" id="input-place-title" required minLength="1" maxLength="30" value={name} onChange={handleNameChange} />
          <span className="modal__error" id="input-place-title-error"></span>
        </label>
        <label className="modal__input-field">
          <input type="url" name="link" placeholder="Ссылка на картинку" className="modal__image-url modal__input-line" id="input-image-url" required value={link} onChange={handleLinkChange} />
          <span className="modal__error" id="input-image-url-error"></span>
        </label>
      </PopupWithForm> 
  )
}


export default AddPlacePopup;