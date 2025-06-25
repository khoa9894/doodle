import { GameStateBase } from "../StateManager/gameStateBase";
import { Renderer } from './../../Graphic/GraphicRender';

export class SettingState extends GameStateBase {
    constructor() {
        super();
    }

    public exit(): void {
        console.log("Exiting Setting State");
    }

    public resume(): void {
        console.log("Resuming Setting State");
    }

    public pause(): void {
        console.log("Pausing Setting State");
    }

    public init(): void {
        console.log("Initializing Setting State");
    }

    public update(deltaTime: number): void {
        console.log(`Updating Setting State with deltaTime: ${deltaTime}`);
    }

    public render(Renderer:Renderer): void {
        
    }
}