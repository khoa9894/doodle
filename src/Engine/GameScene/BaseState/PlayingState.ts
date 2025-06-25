import { GameStateBase } from "../StateManager/gameStateBase";
import { Renderer } from './../../Graphic/GraphicRender';

export class PlayState extends GameStateBase {
    private score: number;
    private highScore: number;

    constructor() {
       super
       ()
    }

    public exit(): void {
        console.log("Exiting Play State");
    }

    public resume(): void {
        console.log("Resuming Play State");
    }

    public pause(): void {
        console.log("Pausing Play State");
    }

    public init(): void {
        console.log("Initializing Play State");
    }

    public update(deltaTime: number): void {
        console.log(`Updating Play State with deltaTime: ${deltaTime}`);
    }

    public render(Renderer:Renderer): void {
        
    }
}
