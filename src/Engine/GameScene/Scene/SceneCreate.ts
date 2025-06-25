import { DashboardScene } from "../../../DoodleJump/Scene/Dashboard";
import { PlayScene } from "../../../DoodleJump/Scene/Play";
import {  SceneName } from "./Scene";


export function createScene(type: SceneName): Engine.IScene {
    switch (type) {
         case SceneName.DashboardScene:
             return new DashboardScene()
            case SceneName.PlayScene:
                return new PlayScene()
        default:
            throw new Error(`Unknown scene type: ${type}`);
    }
}