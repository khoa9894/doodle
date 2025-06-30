import { PlayScene } from '../../../DoodleJump/Scene/Play';
 import { DashboardScene } from '../../../DoodleJump/Scene/Dashboard';
 import { LoadingScene } from '../../../DoodleJump/Scene/LoadingScene';
import { SceneManager } from './SceneManager';

export class SceneBootstrapper {
    public static bootstrapScenes(): void {
       const loadingScene = new LoadingScene();
       const dashboardScene = new DashboardScene();
        const playScene = new PlayScene();
        
        SceneManager.getInstance().AddScene('LoadingScene', loadingScene);
        SceneManager.getInstance().AddScene('DashboardScene', dashboardScene);
        SceneManager.getInstance().AddScene('PlayScene', playScene);
        loadingScene.Init()
        dashboardScene.Init()
        playScene.Init()
    }
}