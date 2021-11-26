import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT"){
    return{
      value: action.val,
      isValid: action.val.includes("@"),
    };
  }
  if (state.type === "INPUT_BLUR"){
    return{
      value: state.value,
      isValid: state.value.includes("@"),
    };
  }
}
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT"){
    return{
      value: action.val,
      isValid: action.val.trim().length > 6,
    };
  }
  if (state.type === "INPUT_BLUR"){
    return{
      value: state.value,
      isValid: state.value.trim().length > 6,
    };
  }
}
const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });

  const {isValid: emailIsValid} = emailState;
  const {isValid: passwordIsValid} = passwordState;
  const authCtx = useContext(AuthContext);
  
  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid( emailIsValid && passwordIsValid );
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: "USER_INPUT",
      val: event.target.value,
    });

    setFormIsValid(
      emailState.isValid && passwordState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: "USER_INPUT",
      val: event.target.value,
    });

    setFormIsValid(
      emailState.isValid && passwordState.isValid
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR"});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR"});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id= "email" 
          label="E-mail" 
          type="email" 
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          // onFocus = {validateEmailHandler}
         />
        <Input
          id= "password" 
          label="Password" 
          type="password" 
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          // onFocus = {validatePasswordHandler}
         />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
