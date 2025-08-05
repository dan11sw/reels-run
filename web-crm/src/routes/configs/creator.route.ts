import { lazy } from "react";
import CreatorRoute from "src/constants/routes/creator.route";
import IRouteModel from "src/models/IRouteModel";

const CreateGamePage = lazy(() => import("src/containers/Creator/CreateGamePage"));
const EditGamePage = lazy(() => import("src/containers/Creator/EditGamePage"));
const GameListPage = lazy(() => import("src/containers/Creator/GameListPage"));
const MarkListPage = lazy(() => import("src/containers/Creator/MarkListPage"));

const CreatorRouteConfig: IRouteModel[] = [
    {
        // URL: /creator
        path: CreatorRoute.BASE,
        element: CreateGamePage
    },
    {
        // URL: /creator/create/game
        path: CreatorRoute.CREATE_GAME,
        element: CreateGamePage
    },
    {
        // URL: /creator/edit/game/:id
        path: CreatorRoute.EDIT_GAME,
        element: EditGamePage
    },
    {
        // URL: /creator/game/list
        path: CreatorRoute.GAME_LIST,
        element: GameListPage
    },
    {
        // URL: /creator/mark/list
        path: CreatorRoute.MARK_LIST,
        element: MarkListPage
    }
];

export default CreatorRouteConfig;