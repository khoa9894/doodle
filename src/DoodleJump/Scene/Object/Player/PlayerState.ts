export interface IDoodleState{
    Init():void
    Update(deltaTime: number): void
    Render(Renderer:Engine.IRenderer): void
}