import { GameStateBase } from "../StateManager/gameStateBase";
import { Renderer } from './../../Graphic/GraphicRender';

export class HighScoreState extends GameStateBase {
    private highScores: number[];

    constructor() {
        super();
        this.highScores = [];
    }

    public exit(): void {
        console.log("Exiting High Score State");
    }

    public resume(): void {
        console.log("Resuming High Score State");
    }

    public pause(): void {
        console.log("Pausing High Score State");
    }

    public init(): void {
        console.log("Initializing High Score State");
    }

    public update(deltaTime: number): void {
        console.log(`Updating High Score State with deltaTime: ${deltaTime}`);
    }

    public render(Renderer:Renderer): void {
    }
}