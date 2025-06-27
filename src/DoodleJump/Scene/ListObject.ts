import { Collision } from './../../Engine/ResourceManager/Collision';
import { Animation } from './../../Engine/Component/Animation';
import { Physic2D } from './../../Engine/Component/Physic2D';
import { ResourceManager} from './../../Engine/ResourceManager/resourceManage';
import { GameObject } from "../../Engine/GameObject/GameObject";
import { Scene } from "../../Engine/GameScene/Scene/Scene";
export class ListObject{
    private anim1: Animation;
        private Background: GameObject;
        private Physic2D: Physic2D;
        private base: GameObject;
        private Player:GameObject;
        private Collision: Collision;
        private listGame: GameObject[]=[];
        private isJump: boolean = false;

    constructor(){
         this.Background = new GameObject({ x: 0, y: 0 }, { width: 900, height: 900 });
                this.Player=new GameObject({ x: 80, y: 480 },{width: 60, height: 60});
                this.base=new GameObject({ x: 80, y: 540 },{width: 60, height: 20});
                this.Collision=new Collision();
                this.Physic2D=new Physic2D({ x: 80, y: 480 }, this.Player.hitbox);
                this.Player.AddComponent(this.Physic2D);
                this.listGame.push(this.Player);
                this.listGame.push(this.base);
    }
    public Init(): void{
        
        this.anim1= new Animation(ResourceManager.getInstance().getTexture('blue-lik-left'), { x: 1, y: 1 }, 0.1);
        this.listGame.push(this.Background);
        this.Player.AddComponent(this.anim1)
        
        this.Background.AddImage(ResourceManager.getInstance().getTexture('loading'))
        this.Collision.addHitBox(this.Player.hitbox);
        this.Collision.addHitBox(this.base.hitbox);
    }
    public update(deltaTime: number): void {
        
    for(const game of this.listGame){
        game.Update(deltaTime)
    }
    if(this.Collision.check()){
        if(!this.isJump) { 
            this.Physic2D.setVelocity({x:0, y:-500}); 
            this.isJump = true;
        }
    } else {
        this.isJump = false; 
    }
}
public render(Renderer: Engine.IRenderer): void {
        const bgImg = this.Background['image'];
        if (bgImg) {
            const canvas = Renderer.getCanvas();
            const imgW = bgImg.width;
            const imgH = bgImg.height;
            const scale = Math.min(canvas.width / imgW, canvas.height / imgH);
            const drawW = imgW * scale;
            const drawH = imgH * scale;
            const offsetX = (canvas.width - drawW) / 2;
            const offsetY = (canvas.height - drawH) / 2;
            canvas.getContext('2d')?.drawImage(bgImg, offsetX, offsetY, drawW, drawH);
        }
        for(const game of this.listGame){
            if (game !== this.Background) {
                game.Render(Renderer);
            }
        }
       
    }

}