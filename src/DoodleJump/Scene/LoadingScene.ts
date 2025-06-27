import { Scene } from "../../Engine/GameScene/Scene/Scene";
import { ResourceManager } from '../../Engine/ResourceManager/resourceManage';
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';

export class LoadingScene extends Scene {
    private loadingComplete: boolean = false;
    private assetsToLoad: string[] = [];
    
    constructor() {
        super();
        this.assetsToLoad = [
            'background',
            'play',
            'loading',
            'blue-lik-left',
            'platform',
        ];
    }

    public Init(): void {
        this.startLoading();
    }

    private async startLoading(): Promise<void> {
        const resourceManager = ResourceManager.getInstance();

        // Tải tất cả tài nguyên
        const promises = this.assetsToLoad.map(assetName => 
            this.loadAsset(resourceManager, assetName)
        );
        
        await Promise.all(promises);
        
        // Chờ thêm 500ms để đảm bảo người dùng thấy màn hình loading
        await this.delay(500);
        
        this.loadingComplete = true;
        
        // Khởi tạo các scene và chuyển đến dashboard
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

    private loadAsset(resourceManager: ResourceManager, assetName: string): Promise<void> {
        return new Promise((resolve) => {
            const img = resourceManager.getTexture(assetName);
            
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Cứ tiếp tục ngay cả khi lỗi
            }
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public render(renderer: Engine.IRenderer): void {
        const canvas = renderer.getCanvas();
        
        renderer.fillRect(0, 0, canvas.width, canvas.height, '#FFFFFF');
        
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