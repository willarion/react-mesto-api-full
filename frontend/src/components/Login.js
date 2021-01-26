import React from 'react';


function Login (props) {
  
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

    if (!email || !password) {
      return;
    }
    props.onSignIn(password, email, resetForm);
  }

  return(
    <div className="authentification">
      <form action="#" className="authentification__containter" onSubmit={handleSubmit} noValidate>
        <fieldset className="authentification__info-input">
          <legend className="authentification__title">
            Вход  
          </legend>
          <label className="authentification__input-field">
            <input type="email" name="email" placeholder="E-mail" className="authentification__input-line" required minLength="2" maxLength="40" 
            value={email} onChange={handleEmailChange} 
            />
          </label>
          <label className="authentification__input-field">
              <input type="password" name="password" placeholder="Пароль" className="authentification__input-line" required minLength="2" maxLength="20" 
              value={password} onChange={handlePasswordChange} />
            </label>
        </fieldset>
        <input type="submit" className="authentification__save-btn" value="Войти" 
        />
      </form>
    </div>
  );
}

export default Login;