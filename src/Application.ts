import { SceneBootstrapper } from './Engine/GameScene/Scene/SceneInit';
import { Renderer } from './Engine/Graphic/GraphicRender';
import { SceneManager } from './Engine/GameScene/Scene/SceneManager';
import { InputHandle } from './Engine/InputHandle/InputHandle';
export class Application{
    private Renderer: Renderer;
    private lastTime: number = 0;
    public Init():void{
        SceneBootstrapper.bootstrapScenes();
        SceneManager.getInstance().changeSceneByName('DashboardScene')
        this.Renderer=new Renderer();
        InputHandle.initialize(  this.Renderer.getCanvas());
    }
    public Run():void{
        this.Init();
        this.lastTime = performance.now();
        const loop = () => {
            const now = performance.now();
            const deltaTime = (now - this.lastTime) / 1000;
            this.lastTime = now;
            this.Update(deltaTime);
            this.Render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
    public Update(deltaTime: number){
        SceneManager.getInstance().getCurrentScene()?.update(deltaTime);
    }
    public Render(){
                SceneManager.getInstance().getCurrentScene()?.render(this.Renderer);

    }
}