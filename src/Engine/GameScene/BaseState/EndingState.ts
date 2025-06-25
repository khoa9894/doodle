import { GameStateBase } from "../StateManager/gameStateBase";
import { Renderer } from './../../Graphic/GraphicRender';

export class EndState extends GameStateBase {
    constructor() {
        super();  
    }

    public exit(): void {
        console.log("Exiting End State");
    }

    public resume(): void {
        console.log("Resuming End State");
    }

    public pause(): void {
        console.log("Pausing End State");
    }

    public init(): void {
        console.log("Initializing End State");
    }

    public update(deltaTime: number): void {
        console.log(`Updating End State with deltaTime: ${deltaTime}`);
    }

    public render(Renderer:Renderer): void {
        
    }
}