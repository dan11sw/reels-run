import { FC } from "react";

export default interface IRouteModel {
  path: string;
  element:
    | FC<any>
    | (() => JSX.Element)
    | React.MemoExoticComponent<any>
    | React.NamedExoticComponent<any>
    | React.LazyExoticComponent<any>;
}
