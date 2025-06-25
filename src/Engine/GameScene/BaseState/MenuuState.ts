import { GameStateBase } from "../StateManager/gameStateBase";
import { Renderer } from './../../Graphic/GraphicRender';


export class MenuState extends GameStateBase {
    constructor() {
        super();
    }

    public exit(): void {
        console.log("Exiting Menu State");
    }

    public resume(): void {
        console.log("Resuming Menu State");
    }

    public pause(): void {
        console.log("Pausing Menu State");
    }

    public init(): void {
        console.log("Initializing Menu State");
    }

    public update(deltaTime: number): void {
        console.log(`Updating Menu State with deltaTime: ${deltaTime}`);
    }

    public render(Renderer:Renderer): void {
    }      
}