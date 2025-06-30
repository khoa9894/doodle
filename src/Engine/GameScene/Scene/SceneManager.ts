import { Scene } from "./Scene";
import { PlayScene } from '../../../DoodleJump/Scene/Play';

export type SceneName = string;

export class SceneManager {
    private static instance: SceneManager;
    private currentScene: Scene | null = null;
    private sceneMap: Map<SceneName, Scene> = new Map();
    private initializedScenes: Set<SceneName> = new Set();

    private constructor() {}

    public static getInstance(): SceneManager {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }

    public AddScene(name: SceneName, scene: Scene): void {
        console.log(`SceneManager: Adding scene "${name}"`);
        this.sceneMap.set(name, scene);
    }

    public getScene(name: SceneName): Scene | undefined {
        return this.sceneMap.get(name);
    }

    public changeScene(scene: Scene): void {
        console.log('SceneManager: Changing scene...');
        
        if (this.currentScene == null) {
            this.currentScene = scene;
        } else {
            this.currentScene?.exit();
            this.currentScene = scene;
        }
    }
   
    public changeSceneByName(name: SceneName): void {
        console.log(`SceneManager: Changing to scene "${name}"`);
        
        const scene = this.getScene(name);
        if (scene) {
            this.changeScene(scene);
            
            if (!this.initializedScenes.has(name)) {
                console.log(`SceneManager: Initializing scene "${name}" for the first time`);
                scene.Init();
                this.initializedScenes.add(name);
            } else {
                console.log(`SceneManager: Scene "${name}" already initialized`);
            }
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