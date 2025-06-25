import { Renderer } from '../../Graphic/GraphicRender';
export enum StateTypes {
    MENU,
    PLAY,
    SETTING,
    HIGHSCORE,
    END,
}
export abstract class GameStateBase {
    constructor() {}
    public abstract exit(): void;
    public abstract resume(): void;
    public abstract pause(): void;
    public abstract init(): void;
    public abstract update(deltaTime: number): void;
    public abstract render(renderer: Renderer): void;
}