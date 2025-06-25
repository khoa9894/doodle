export abstract class Component {
    constructor() {}
    public abstract Init(): void;
    public abstract update(deltaTime: number): void;
    public abstract render(renderer: Engine.IRenderer, x: number, y: number): void;
}