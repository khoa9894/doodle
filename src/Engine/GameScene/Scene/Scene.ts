import { HighScoreState } from './../BaseState/HighState';
export enum SceneName {
    DashboardScene,
    PlayScene,
    SettingScene,
    HighScoreScene,
    EndScene,
}


export class Scene implements Engine.IScene{
    constructor() {
        
    }
    public pause():void{}
    public Init(): void {}
    public update(deltaTime: number): void {}
    public exit():void{}
    public resume(): void{}
    public render(Renderer:Engine.IRenderer): void {}
}