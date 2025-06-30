//import { PlayScene } from './../../../DoodleJump/Scene/Play';
import { Scene } from "./Scene";
import { PlayScene } from '../../../DoodleJump/Scene/Play';
// import { DashboardScene } from '../../../DoodleJump/Scene/Dashboard';
export type SceneName = string;

export class SceneManager {
    private static instance: SceneManager;
    private currentScene: Scene | null = null;
    private sceneMap: Map<SceneName, Scene> = new Map();

    private constructor() {}

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    public AddScene(name: SceneName, scene: Scene): void {
        this.sceneMap.set(name, scene);
    }

    public getScene(name: SceneName): Scene | undefined {
        return this.sceneMap.get(name);
    }

    public changeScene(scene: Scene): void {
        if(this.currentScene==null){
            this.currentScene = scene;
           // this.currentScene.Init();
        }
        else{
             this.currentScene?.exit();
            this.currentScene = scene;
           // this.currentScene.Init();
        }
     
    }
   
    public changeSceneByName(name: SceneName): void {
        const scene = this.getScene(name);
        if (scene) {
            this.changeScene(scene);
        } else {
            console.warn(`Scene "${name}" not found in sceneMap.`);
        }
    }

    public getCurrentScene(): Scene | null {
        return this.currentScene;
    }
    public getCurrentSceneByName(): string {
    for (const [name, scene] of this.sceneMap.entries()) {
        if (scene === this.currentScene) {
            return name;
        }
    }
    return "";
}
    
}