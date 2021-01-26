import React from 'react';


function PopupWithForm(props) {
  return (
    <div className={props.isOpen ? `modal_visible modal modal_${props.modalName}` : `modal modal_${props.modalName}`}>
      <form action="#" className={`modal__container modal__${props.formName}`} onSubmit={props.onSubmit} noValidate>
        <button type="reset" className="modal__reset-btn" onClick={props.onClose} />
        <fieldset className="modal__info-input">
          <legend className="modal__title">{props.title}</legend>
          {props.children}  
        </fieldset>
        <input type="submit" className="modal__save-btn" value={props.buttonValue} />
      </form>
    </div>
  )
}

export default PopupWithForm;