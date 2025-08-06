/* Контекст */
import { markSlice } from "src/store/reducers/Map/MarkSlice";
import messageQueueAction from "../MessageQueueAction";

/* Константы */
import apiMainServer from "src/http/http";
import { FunctionVOID } from "src/types/function";
import MapApi from "src/constants/api/map.api";
import { IMark, IMarkId, IMarkModel } from "src/models/IMarkModel";
import { isHttpStatusValid } from "src/utils/http";

function getFreeMarks(cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(markSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.get(MapApi.MARKS_FREE);

      if (!isHttpStatusValid(response?.status)) {
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

function createMark(data: IMark, cb?: (id?: number) => void) {
  return async function (dispatch: any) {
    dispatch(markSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        MapApi.MARK_CREATE,
        JSON.stringify(data),
      );

      if (!isHttpStatusValid(response?.status)) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      cb && cb(response?.data?.id);
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    } finally {
      dispatch(markSlice.actions.loadingEnd());
    }
  };
}

function updateMark(data: IMarkModel, cb?: (id?: number) => void) {
  return async function (dispatch: any) {
    dispatch(markSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        MapApi.MARK_UPDATE,
        JSON.stringify(data),
      );

      if (!isHttpStatusValid(response?.status)) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      cb && cb(response?.data?.id);
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    } finally {
      dispatch(markSlice.actions.loadingEnd());
    }
  };
}

function deleteMark(data: IMarkId, cb?: (id?: number) => void) {
  return async function (dispatch: any) {
    dispatch(markSlice.actions.loadingStart());

    try {
      const response = await apiMainServer.post(
        MapApi.MARK_DELETE,
        JSON.stringify(data),
      );

      if (!isHttpStatusValid(response?.status)) {
        dispatch(messageQueueAction.addMessage(response, "error"));
        return;
      }

      cb && cb(response?.data?.id);
    } catch (e: any) {
      dispatch(messageQueueAction.errorMessage(e));
    } finally {
      dispatch(markSlice.actions.loadingEnd());
    }
  };
}

const MarkAction = {
  getFreeMarks,
  createMark,
  updateMark,
  deleteMark
};

export default MarkAction;
