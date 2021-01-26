import React from 'react';


function ImagePopup(props) {

  return (
    <div className={props.isOpen ? `modal_visible modal modal_type_big-image` : 'modal modal_type_big-image'}>
      <figure className="modal__figure">
        <button type="reset" className="modal__reset-btn" onClick={props.onClose} />
        <img src={props.card.link} alt={props.card.name} className="modal__image" />
        <figcaption className="modal__caption">{props.card.name}</figcaption>
      </figure>
    </div>
  )
}

export default ImagePopup;