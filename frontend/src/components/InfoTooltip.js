import React from 'react';

function InfoTooltip(props) {


  return (
    <div className={props.isOpen ? `modal_visible modal modal_info-tooltip` : `modal modal_info-tooltip`}>
      <div className="modal__container modal__tooltip-container">
        <button type="reset" className="modal__reset-btn" onClick={props.onClose} />
        <div className="modal__tooltip-image"  style={{ backgroundImage: `url(${props.tooltipImage})` }} />
        <p className="modal__tooltip-caption">
          {props.tooltipMessage}
        </p>
      </div>
    </div>
  )
}

export default InfoTooltip;