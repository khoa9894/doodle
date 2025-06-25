//import { Application } from './Application';
"use strict";
// import { ResourceManager } from './Engine/ResourceManager/resourceManage'; 
//import { StateManage } from './GameScene/StateManager/StateManage';
// import { StateTypes } from './Engine/GameScene/StateManager/gameStateBase';
// import {Renderer} from './Engine/Graphic/GraphicRender';
// import { GameObject}  from './Engine/GameObject/GameObject';
// import { HitBox } from './Engine/Component/HitBox';
// //import { Collision } from './ResourceManager/Collision';
// import { Animation } from './Engine/Component/Animation';
// import { Physic2D } from './Engine/Component/Physic2D';
// import { InputHandle } from './Engine/InputHandle/InputHandle';
// import { StateManage } from './Engine/GameScene/StateManager/StateManage';
// import { Button } from './Engine/Component/Button';
 class Game {
    private Application: Application
     constructor() {
    //     console.log('Game created');
    //     const resourceManager = ResourceManager.getInstance();
    //     const logo = resourceManager.getTexture('Default');
    //     const boss= resourceManager.getTexture('walk_look up');
    //     const cc= resourceManager.getTexture('Fire+Sparks-Sheet');

    //     let Graphic = new Renderer();
    //  //   Graphic.render( logo,10, 0);
    //     // StateManage test: chuyển state mỗi 2s
    //     // const stateManage = StateManage.getInstance();
    //     // const states = [
    //     //     StateTypes.MENU,
    //     //     StateTypes.PLAY,
    //     //     StateTypes.SETTING,
    //     //     StateTypes.HIGHSCORE,
    //     //     StateTypes.END
    //     // ];
    //     // let idx = 0;
    //     // function switchState() {
    //     //     stateManage.changeStateByType(states[idx]);
    //     //     const current = stateManage.getNextState();
    //     //     if (current) {
    //     //         current.init();
    //     //         //console.log('Switched to state:', StateTypes[states[idx]]);
    //     //     }
    //     //     idx = (idx + 1) % states.length;
    //     // };
    //     // switchState();
    //     // setInterval(switchState, 2000);

    //     // Test GameObject
    //     // const hitBox = new HitBox(200, 200, 100, 100);
    //     // const hitbox2= new HitBox(300, 300, 100, 100);
    //      const gameObject = new GameObject({ x: 200, y: 300 }, { width: 100, height: 100 });
    //      const gameObject1 = new GameObject({ x: 200, y: 300 }, { width: 200, height: 300 });
    //      const gameObject3 = new GameObject({ x: 0, y: 0 }, { width: 900, height: 900 });
    //      gameObject3.AddImage(logo)
    //      const anim = new Animation(boss, { x: 5, y: 4 }, 0.1); 
    //      const physic = new Physic2D({ x: 200, y: 100 }, gameObject.getComponentByName('HitBox') as HitBox);
    //     const anim1= new Animation(cc, { x: 4, y: 5 }, 0.1);
    //    //  const physic = new Physic2D({ x: 200, y: 100 }); 
    //        gameObject.AddComponent(physic);
    //         gameObject1.AddComponent(anim1);
    //         gameObject.AddComponent(anim);
    //        let lastTime = performance.now();
    //        let x=10;
    //        InputHandle.initialize(Graphic.getCanvas());
    //         // const ctx = Graphic.getCanvas().getContext('2d');
    //         // if (ctx && logo) ctx.drawImage(logo, 0, 0,600,800);
    //        let speed = 200; // pixel/giây
    //        setInterval(() => {
    //         const now = performance.now();
    //         const delta = (now - lastTime) / 1000;
    //         lastTime = now;
    //         if (InputHandle.isKeyDown('arrowleft')) {
    //             physic.addForce({ x: -5, y: 0 });
    //         }
    //         if (InputHandle.isKeyDown('w')){
    //             physic.addForce({ x: 0, y: -30 });
    //         }
            
    //         gameObject.Update(delta);
    //         gameObject3.Update(delta);
    //         // Test Button
    //     // const button = new Button({ x: 120, y: 60 }, { x: 100, y: 40 });
    //     // button.setOnClick(() => {
    //     //     console.log('ff');
    //     // });
    //         gameObject.Update(delta);
    //      //   button.update(delta);
    //         const ctx = Graphic.getCanvas().getContext('2d');
    //         if (ctx) {
                 
    //             ctx.clearRect(0, 0, Graphic.getCanvas().width, Graphic.getCanvas().height);
    //             gameObject3.Render(Graphic);
    //             gameObject.Render(Graphic);
                               

    //            // button.render(Graphic);
    //         }
    //     }, 2); 
      //  this.Application.Run();
    }
}

new Game();
import { Application } from './Application';

const app = new Application();
app.Run();