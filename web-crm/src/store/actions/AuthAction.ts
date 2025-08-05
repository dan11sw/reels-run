/* Контекст */
import { authSlice } from "../reducers/AuthSlice";
import messageQueueAction from "./MessageQueueAction";

/* Константы */
import apiMainServer from "src/http/http";
import MainApi from "src/constants/api/main.api";
import { HeadersDefaultJSON } from "src/config/headers.default";
import { IAuthData, IAuthModel, IAuthRefresh } from "src/models/IAuthModel";
import { FunctionVOID } from "src/types/function";

function signIn(data: IAuthData, cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(authSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        MainApi.SIGN_IN,
        JSON.stringify(data),
        {
          ...HeadersDefaultJSON,
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(authSlice.actions.signInSuccess(response.data));
      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    } finally {
      dispatch(authSlice.actions.loadingEnd());
    }
  };
}

function getAuthData() {
  return async function (dispatch: any) {
    try {
      dispatch(authSlice.actions.getAuthData());
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }
  };
}

function setAuthData(data: IAuthModel) {
  return async function (dispatch: any) {
    try {
      dispatch(authSlice.actions.loadingStart());
      dispatch(authSlice.actions.setAuthData(data));
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }

    dispatch(authSlice.actions.loadingEnd());
  };
}

function logout(cb?: FunctionVOID) {
  return async function (dispatch: any) {
    try {
      dispatch(authSlice.actions.logout());
      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    }
  };
}

function refreshToken(data: IAuthModel) {
  return async function (dispatch: any) {
    dispatch(authSlice.actions.loadingStart());
    try {
      dispatch(authSlice.actions.signInSuccess(data));
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    } finally {
      dispatch(authSlice.actions.loadingEnd());
    }
  };
}

const AuthAction = {
  signIn,
  getAuthData,
  setAuthData,
  logout,
  refreshToken,
};

export default AuthAction;
