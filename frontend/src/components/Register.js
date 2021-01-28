import React from 'react';
import { Link } from 'react-router-dom';


function Register (props) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function resetForm() {
    setEmail('');
    setPassword('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onSignUp(password, email, resetForm);
  }

  return(
    <div className="authentification">
      <form action="#" className="authentification__containter" onSubmit={handleSubmit} noValidate>
        <fieldset className="authentification__info-input">
          <legend className="authentification__title">
            Регистрация
          </legend>
          <label className="authentification__input-field">
            <input type="email" name="email" placeholder="E-mail" className="authentification__input-line" required minLength="2" maxLength="40" 
            value={email} onChange={handleEmailChange} 
            />
          </label>
          <label className="authentification__input-field">
              <input type="password" name="password" placeholder="Пароль" className="authentification__input-line" required minLength="2" maxLength="20" 
              value={password} onChange={handlePasswordChange} 
              />
            </label>
        </fieldset>
        <input type="submit" className="authentification__save-btn" 
        value="Зарегистрироваться"
        />
        <Link to="/sign-in" className="authentification__hint">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
}

export default Register;