import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {

  const avatarInputRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
  
    props.onUpdateAvatar({
      avatar: avatarInputRef.current.value,
    });
  }

  return (
    <PopupWithForm modalName="type_edit-avatar" formName="edit-avatar-form" title="Обновить аватар" buttonValue="Сохранить" isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit}>
      <label className="modal__input-field">
        <input ref={avatarInputRef} type="url" name="avatar" placeholder="Ссылка на аватар" className="modal__avatar-url modal__input-line" id="input-avatar-url" required />
        <span className="modal__error" id="input-avatar-url-error"></span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;