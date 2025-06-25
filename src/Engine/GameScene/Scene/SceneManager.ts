import { Scene, SceneName } from "./Scene";
import { Renderer } from "../../Graphic/GraphicRender";
import { createScene } from "./SceneCreate";
export class SceneManager {
    private static instance: SceneManager;
    private stack: Scene[] = [];
    private currentScene: Scene | null = null;
    private nextScene: Scene | null = null;

    private constructor() {
    }

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }


    public changeScene(Scene:Engine.IScene): void {
        this.nextScene=Scene;
        
    }
    public changeSceneByName(Name: SceneName): void{
        const SG=createScene(Name);
        this.changeScene(SG);

    }
    public pushScene(Name: SceneName): void {
        const SG=createScene(Name);
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].pause();
        }
        this.nextScene = SG;
    }

    public popScene(): void {
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].exit();
            this.stack.pop();
        }
        if (this.stack.length > 0) {
            this.stack[this.stack.length - 1].resume();
        }
        this.currentScene = this.stack[this.stack.length - 1];
    }

    public performSceneChange(): void {
        if (this.nextScene) {
            if (this.stack.length > 0) {
                this.stack[this.stack.length - 1].exit();
            }
            this.stack.push(this.nextScene);
            this.stack[this.stack.length - 1].Init();
            this.currentScene = this.nextScene;
            this.nextScene = null;
        }
    }
    public needToChangeScene(): boolean {
        return this.nextScene !== null;
    }
    public getCurrentScene(): Scene | null {
        return this.currentScene;
    }

    public getNextScene(): Scene | null {
        return this.nextScene;
    }

    public hasScene(): boolean {
        return this.stack.length > 0;
    }
}