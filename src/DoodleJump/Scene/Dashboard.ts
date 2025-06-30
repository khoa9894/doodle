import { Button } from './../../Engine/Component/Button';
import { ResourceManager} from './../../Engine/ResourceManager/resourceManage';
import { SceneManager } from '../../Engine/GameScene/Scene/SceneManager';
import { Scene } from "../../Engine/GameScene/Scene/Scene";
import { ListObject } from './ListObject';
import { InputHandle } from "../../Engine/InputHandle/InputHandle";

export class DashboardScene extends Scene {
    private ListObject: ListObject;
    private Butt: Button;
    private lastScore: number = 0;
    private highScore: number = 0;
    private isFirstLoad: boolean = true;
    
    constructor() {
        super();
        this.ListObject = new ListObject();
                this.ListObject.Init();

        this.Butt = new Button({ x: 100, y: 50 }, { x: 200, y: 300 });
        
        this.Butt.setOnClick(() => {
            console.log('Button clicked!');
            setTimeout(() => {
                SceneManager.getInstance().changeSceneByName('PlayScene');
            }, 100);
        });
    }
    
    public exit(): void {
        console.log('Exiting Dashboard Scene');
    }
    
    public Init(): void {
        this.Butt.AddImage(ResourceManager.getInstance().getTexture('play'));
        
        this.loadScores();
        this.isFirstLoad = false;
    }
    
    private loadScores(): void {
        const savedHighScore = localStorage.getItem('doodleJump_highScore');
        if (savedHighScore) {
            this.highScore = parseInt(savedHighScore);
        }
        
        const savedCurrentScore = localStorage.getItem('doodleJumpCurrentScore');
        if (savedCurrentScore) {
            this.lastScore = parseInt(savedCurrentScore);
        }
    }
    
    public update(deltaTime: number): void {
        this.ListObject.update(deltaTime);
        this.Butt.Update(deltaTime);
    }
    
    public render(renderer: Engine.IRenderer): void {
        this.ListObject.render(renderer);
        this.Butt.Render(renderer);
    
        
        // if (!this.isFirstLoad) {
            
        //     renderer.drawText(
        //         `High Score: ${this.highScore}`, 
        //         250,  
        //         220,  
        //         "28px Arial",  
        //         "center",      
        //         "Red"        
        //     );
        // }
    }
}