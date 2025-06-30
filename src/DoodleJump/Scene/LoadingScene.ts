import { Scene } from "../../Engine/GameScene/Scene/Scene";
import { ResourceManager } from '../../Engine/ResourceManager/resourceManage';
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';

export class LoadingScene extends Scene {
    private loadingComplete: boolean = false;
    private assetsToLoad: string[] = [];
    
    constructor() {
        super();
        this.assetsToLoad = [
            // UI Assets
            'background',
            'play',
            'loading',
            
            'platform',
            'spring',
            'invi',
            
            'jump-left',
            'jump-right',
            'touch-left',
            'touch-right',
            'walk_look up',
            'flying',
            
            'duma',
            'stretch',
            'rocket',
            'stool',
            
            'concu',
            'dicho',
            'ditconme',
            'chode',
            
            'space',
            'Default',
            'after',
            'before'
        ];
    }

    public Init(): void {
        this.startLoading();
    }

    private async startLoading(): Promise<void> {
        const resourceManager = ResourceManager.getInstance();
        
        for (const assetName of this.assetsToLoad) {
            resourceManager.addTexture(assetName);
        }
        
        await this.delay(600);
        
        this.loadingComplete = true;
        
        this.initializeGameScenes();
        SceneManager.getInstance().changeSceneByName('DashboardScene');
    }

    private initializeGameScenes(): void {
        const sceneManager = SceneManager.getInstance();
        
        const dashboardScene = sceneManager.getScene('DashboardScene');
        const playScene = sceneManager.getScene('PlayScene');

        if (dashboardScene) {
            dashboardScene.Init();
        }
        
        if (playScene) {
            playScene.Init();
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public render(renderer: Engine.IRenderer): void {
        const canvas = renderer.getCanvas();
        
        // Màn hình trắng
        renderer.fillRect(0, 0, canvas.width, canvas.height, '#FFFFFF');
        
        // Chữ "Loading"
        renderer.drawText(
            "Loading...", 
            canvas.width / 2, 
            canvas.height / 2, 
            "24px Arial", 
            "center", 
            "#000000"
        );
    }

    public exit(): void {
        this.loadingComplete = false;
    }
}