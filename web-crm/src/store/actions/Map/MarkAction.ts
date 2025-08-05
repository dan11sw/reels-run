/* Контекст */
import { markSlice } from "src/store/reducers/Map/MarkSlice";
import messageQueueAction from "../MessageQueueAction";

/* Константы */
import apiMainServer from "src/http/http";
import { FunctionVOID } from "src/types/function";
import MapApi from "src/constants/api/map.api";
import { IMark } from "src/models/IMarkModel";

function getFreeMarks(cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(markSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.get(MapApi.MARKS_FREE);

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      dispatch(markSlice.actions.setFreeMarks(response.data));
      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    } finally {
      dispatch(markSlice.actions.loadingEnd());
    }
  };
}

function createMark(data: IMark, cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(markSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        MapApi.MARK_CREATE,
        JSON.stringify(data),
      );

      /*const response = await apiMainServer.post(
        MainApi.SIGN_IN,
        JSON.stringify(data),
        {
          ...HeadersDefaultJSON,
        }
      );*/

      if (response.status !== 200 && response.status !== 201) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      cb && cb();
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    } finally {
      dispatch(markSlice.actions.loadingEnd());
    }
  };
}

const MarkAction = {
  getFreeMarks,
  createMark
};

export default MarkAction;
