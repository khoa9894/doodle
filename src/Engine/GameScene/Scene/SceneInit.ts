import { PlayScene } from '../../../DoodleJump/Scene/Play';
import { DashboardScene } from '../../../DoodleJump/Scene/Dashboard';
import { SceneManager } from './SceneManager';

export class SceneBootstrapper {
    public static bootstrapScenes(): void {
        const dashboardScene = new DashboardScene();
        const playScene = new PlayScene();
        dashboardScene.Init();
        playScene.Init();
        SceneManager.getInstance().AddScene('DashboardScene', dashboardScene);
        SceneManager.getInstance().AddScene('PlayScene', playScene);
    }
}