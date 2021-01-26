import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';


function EditProfilePopup(props) {

  const currentUser = React.useContext(CurrentUserContext);
  const escape = require('escape-html');

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  
  React.useEffect(() => {
    setName(currentUser.name || '');
    setDescription(currentUser.about || '');
  }, [currentUser]);


  function handleNameChange(evt) {
    setName(escape(evt.target.value));
  }
  function handleDescriptionChange(evt) {
    setDescription(escape(evt.target.value));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    
    props.onUpdateUser({
      name,
      about: description,
    });
  }


  return (
    <PopupWithForm modalName="type_edit-profile" formName="edit-profile-form" title="Редактировать профиль" buttonValue="Сохранить" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} >
        <label className="modal__input-field">
            <input type="text" name="name" placeholder="Имя" className="modal__name modal__input-line" id="input-name" required minLength="2" maxLength="40" value={name} onChange={handleNameChange} />
            <span className="modal__error" id="input-name-error"></span>
        </label>
        <label className="modal__input-field">
            <input type="text" name="about" placeholder="О вас" className="modal__bio modal__input-line" id="input-bio" required minLength="2" maxLength="200" value={description} onChange={handleDescriptionChange} />
            <span className="modal__error" id="input-bio-error"></span>
        </label>
      </PopupWithForm>
  )
}

export default EditProfilePopup;