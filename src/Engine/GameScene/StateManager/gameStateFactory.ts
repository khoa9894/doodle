
import { StateTypes } from "./gameStateBase";
import { MenuState } from "../BaseState/MenuuState";
import { PlayState } from "../BaseState/PlayingState";
import { SettingState } from "../BaseState/ConfigState";
import { HighScoreState } from "../BaseState/HighState";
import { EndState } from "../BaseState/EndingState";
import { GameStateBase } from "./gameStateBase";

export function createState(type: StateTypes): GameStateBase {
    switch (type) {
        case StateTypes.MENU:
            return new MenuState();
        case StateTypes.PLAY:
            return new PlayState();
        case StateTypes.SETTING:
            return new SettingState();
        case StateTypes.HIGHSCORE:
            return new HighScoreState();
        case StateTypes.END:
            return new EndState();
        default:
            throw new Error("Unknown state type");
    }
}
