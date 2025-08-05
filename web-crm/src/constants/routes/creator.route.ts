export const CREATOR_ROUTE_DEFAULT = "/creator";

const CreatorRoute = {
  BASE: `${CREATOR_ROUTE_DEFAULT}`,
  CREATE_GAME: `${CREATOR_ROUTE_DEFAULT}/create/game`,
  EDIT_GAME: `${CREATOR_ROUTE_DEFAULT}/edit/game/:id`,
  GAME_LIST: `${CREATOR_ROUTE_DEFAULT}/game/list`,
  MARK_LIST: `${CREATOR_ROUTE_DEFAULT}/mark/list`
};

export default CreatorRoute;
