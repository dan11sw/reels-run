export const PlayerRouteBase = "/api/player";

const PlayerRoute = {
    // Route: /info
    info: '/info',
    infoUpdate: '/info/update',
    infoImg: '/info/img',
    infoImgUpdate: '/info/img/update',

    // Route: /command
    command: '/command',
    commandPlayers: '/command/players',
    commandCurrentGame: '/command/current/game',
    commandGames: '/command/games',
    commandsList: '/commands/list',
    commandJoin: '/command/join',
    commandDetach: '/command/detach',
    commandCreate: '/command/create',
    commandRegisterGame: '/command/register/game',
    commandAvailableGames: '/command/available/games',
    commandFreeListTag: '/command/free/list/tag',
    commandJoinCertain: '/command/join/certain',
    commandCurrentMediaInstructions: '/command/current/media/instructions',
    commandAddResult: '/command/add/result',

    // Route: /game
    gameStatus: '/game/status',
    gameInfo: '/game/info',

    statistics: '/statistics',
    findCertain: '/find/certain',
    judgeGetInfo: '/judge/get/info',
    judgeSetScore: '/judge/set/score',
    joinGame: '/join/game',
    detachGame: '/detach/game',
    completedGame: '/completed/game',
    games: '/games',

    setResultGameImage: '/set/result/game/image',
    removeResultGameImage: '/remove/result/game/image',
};

export default PlayerRoute;