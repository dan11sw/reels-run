/* Контекст */
import { iCreatorSlice } from "src/store/reducers/Creator/internal/ICreatorSlice";

/* Константы */
import { FunctionVOID } from "src/types/function";
import { IQuestData } from "src/models/IQuestModel";
import { isUndefinedOrNull } from "src/types/void_null";

function setQuests(data: IQuestData[], cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(iCreatorSlice.actions.setQuests(data));
    cb && cb();
  };
}

function addQuest(data: IQuestData, cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(iCreatorSlice.actions.addQuest(data));
    cb && cb();
  };
}

function updateQuest(data: IQuestData, cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(iCreatorSlice.actions.updateQuest(data));
    cb && cb();
  };
}

function removeQuest(id: number, cb?: FunctionVOID) {
  return async function (dispatch: any) {
    dispatch(iCreatorSlice.actions.removeQuest(id));
    cb && cb();
  };
}

function clearAll() {
  return async function (dispatch: any) {
    dispatch(iCreatorSlice.actions.clear());
  };
}

const ICreatorAction = {
  setQuests,
  addQuest,
  updateQuest,
  removeQuest,
  clearAll
};

export default ICreatorAction;
