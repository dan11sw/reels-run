import { FC, useCallback, useEffect, useState } from "react";
import NetmanPng from "src/assets/images/netman.png";
import styles from "./SignInPage.module.scss";
import Input from "src/components/UI/Input";
import Button from "src/components/UI/Button";
import { useAppDispatch, useAppSelector } from "src/hooks/redux.hook";
import messageQueueAction from "src/store/actions/MessageQueueAction";
import BaseRoute from "src/constants/routes/base.route";
import { useLocation, useNavigate } from "react-router-dom";
import { IAuthData } from "src/models/IAuthModel";
import { InputValueType } from "src/types/input";
import AuthAction from "src/store/actions/AuthAction";
import Loader from "src/components/UI/Loader";

const SignInPage: FC<any> = () => {
  const authSlice = useAppSelector((s) => s.authReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<IAuthData>({
    password: '',
    email: ''
  });

  const changePassword = (value: InputValueType) => {
    setForm({
      ...form,
      password: String(value)
    });
  };

  const changeEmail = (value: InputValueType) => {
    setForm({
      ...form,
      email: String(value)
    });
  };

  const clickSignIn = () => {
    if (form.email.trim().length === 0) {
      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо ввести почтовый адрес"));
      return;
    }

    if (form.password.trim().length === 0) {
      dispatch(messageQueueAction.addMessage(null, "error", "Необходимо ввести пароль"));
      return;
    }

    dispatch(AuthAction.signIn(form, () => {
      dispatch(messageQueueAction.addMessage(null, "success", "Успешная авторизация пользователя!"));
      navigate(BaseRoute.HOME);
    }));
  };

  const clickEnter = useCallback((e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      clickSignIn();
    }
  }, [form]);

  useEffect(() => {
    document.addEventListener("keydown", clickEnter);

    return () => {
      document.removeEventListener("keydown", clickEnter);
    }
  }, [clickEnter]);

  useEffect(() => {
    if (authSlice.access_token?.length && authSlice.isAuthenticated) {
      navigate(BaseRoute.HOME);
    }
  }, [authSlice]);

  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.form}>
            <div className={styles.title}>
              <img className={styles.imgLogo} src={NetmanPng} />
              <p>Авторизация</p>
            </div>
            <div className={styles.control}>
              <Input
                label={"Email"}
                title={"Введите email"}
                type={"text"}
                changeHandler={changeEmail}
              />
              <Input
                label={"Пароль"}
                title={"Введите пароль"}
                type={"password"}
                changeHandler={changePassword}
              />
              <Button
                customClass={styles.btnAuth}
                label={"Авторизация"}
                clickHandler={clickSignIn}
              />
            </div>
          </div>
        </div>
      </div>

      {
        authSlice.isLoading && <Loader />
      }
    </>
  );
};

export default SignInPage;
