declare namespace Engine {
    
    interface IComponent{
        Init(): void;
        update(deltaTime: number): void;
        render(renderer: IRenderer, x: number, y: number): void;
    }

    interface IRenderer {
        render(image: HTMLImageElement, x: number, y: number): void;
        fillRect(x: number, y: number, width: number, height: number, color: string): void;
        drawRect(x: number, y: number, width: number, height: number): void
        drawFrame(
        image: HTMLImageElement,
        sx: number, sy: number, sw: number, sh: number,
        dx: number, dy: number, dw: number, dh: number
    ): void
        getCanvas(): HTMLCanvasElement
        public drawText(
    text: string, 
    x: number, 
    y: number, 
    font: string = "20px Arial", 
    textAlign: CanvasTextAlign = "center", 
    color: string = "black"
): void

    }
    interface IPhysic2D extends IComponent{
        getPosition(): IVec2;
        setPosition(pos: IVec2): void;
        setVelocity(vel: IVec2): void;
        setAcceleration(acc: IVec2): void;
        setGravity(g: number): void;
        enableGravity(enable: boolean): void;
        addForce(force: IVec2): void;
    }
    interface IAnimation extends IComponent{
        update(deltaTime: number):void;
        render(renderer: Renderer, x: number, y: number): void;
    }
    interface IGameObject{
        position: IVec2;
        size: { width: number; height: number };
        active: boolean;
        AddComponent(cpn: IComponent): void;
        //getComponentByName(name: string): IComponent | undefined;
        Update(deltaTime: number): void;
        Render(renderer: IRenderer): void;
    }

    interface IHitBox extends IComponent {
        setPosition(pos: IVec2): void;
        getPosX(): number;
        getPosY(): number;
        getWidth(): number;
        getHeight(): number;
        setDeActive(): void;
        intersects(other: IHitBox): boolean;
    }

    interface IResourceManager {
        addTexture(name: string): void;
        getTexture(name: string): HTMLImageElement;
    }

    interface IInputHandle {
        initialize(): void;
        isKeyDown(key: string): boolean;
    }

    interface IGameState {
        exit(): void;
        resume(): void;
        pause(): void;
        init(): void;
        update(deltaTime: number): void;
        render(renderer: IRenderer): void;
    }

    interface IScene {
        Init(): void;
        exit():void;
        resume():void;
        pause():void;
        update(deltaTime: number): void;
        render(renderer: IRenderer): void;
    }

    interface ISceneManager {
        getCurrentScene(): IScene;
        changeScene(sceneName: string): void;
        addScene(scene: IScene): void;
        update(deltaTime: number): void;
        render(renderer: IRenderer): void;
    }
}



interface IVec2 {
    x: number,
    y: number
}

