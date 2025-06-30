/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/Engine/ResourceManager/Collision.ts
class Collision {
    constructor() {
        this.listHitbox = [];
    }
    addHitBox(hitBox) {
        this.listHitbox.push(hitBox);
    }
    update(deltaTime) {
    }
    render(renderer) {
    }
    check() {
        for (let i = 0; i < this.listHitbox.length; i++) {
            for (let j = i + 1; j < this.listHitbox.length; j++) {
                if (this.listHitbox[i].intersects(this.listHitbox[j])) {
                    return true;
                }
            }
        }
        return false;
    }
}

;// ./src/Engine/ResourceManager/resourceManage.ts
class ResourceManager {
    constructor() {
        this.path_name = "assets/images/";
        this.texture_path = this.path_name;
        this.map_texture = new Map();
    }
    static getInstance() {
        if (!ResourceManager.instance) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }
    addTexture(name) {
        if (this.map_texture.has(name))
            return;
        const img = new Image();
        img.src = this.texture_path + name + ".png";
        this.map_texture.set(name, img);
    }
    getTexture(name) {
        let texture = this.map_texture.get(name);
        if (texture)
            return texture;
        texture = new Image();
        texture.src = this.texture_path + name + ".png";
        this.map_texture.set(name, texture);
        return texture;
    }
}

;// ./src/Engine/GameObject/GameObject.ts
class GameObject {
    constructor(position, size) {
        this._listComponent = [];
        this._position = position;
        this._size = size;
        this._active = true;
    }
    AddImage(image) {
        this.image = image;
    }
    AddComponent(cpn) {
        const find = this._listComponent.find(c => c.constructor.name === cpn.constructor.name);
        if (find) {
            throw new Error('co roi');
        }
        else {
            this._listComponent.push(cpn);
        }
    }
    setPosition(pos) {
        this._position = pos;
    }
    activePhysic2d(hi) {
        const Physic2D = this.getComponent('Physic2D');
        if (Physic2D) {
            Physic2D.setReverse(hi);
        }
    }
    activeHitbox(hi) {
        const hitbox = this.getComponent('HitBox');
        if (hitbox) {
            hitbox.setDeActive(hi);
        }
    }
    Update(deltaTime) {
        if (!this._active)
            return;
        const hitbox = this.getComponent('HitBox');
        if (hitbox) {
            hitbox.setPosition(this._position);
        }
        for (const component of this._listComponent) {
            if (component.update) {
                component.update(deltaTime);
            }
        }
    }
    setSize(size) {
        this._size = size;
    }
    Render(renderer) {
        if (this.image)
            renderer.render(this.image, this.position.x, this.position.y);
        for (const component of this._listComponent) {
            component.render(renderer, this.position.x, this.position.y);
        }
    }
    getComponent(typeName) {
        for (const component of this._listComponent) {
            if (component.constructor.name === typeName) {
                return component;
            }
        }
        return null;
    }
    getAnimation() {
        return this.getComponent('Animation');
    }
    getPhysics() {
        return this.getComponent('Physic2D');
    }
    getHitBox() {
        return this.getComponent('HitBox');
    }
    // Debug method to check all components
    getComponentNames() {
        return this._listComponent.map(c => c.constructor.name);
    }
    get position() {
        return this._position;
    }
    get size() {
        return this._size;
    }
    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
    }
}

;// ./src/Engine/GameScene/Scene/Scene.ts
var SceneName;
(function (SceneName) {
    SceneName[SceneName["DashboardScene"] = 0] = "DashboardScene";
    SceneName[SceneName["PlayScene"] = 1] = "PlayScene";
    SceneName[SceneName["SettingScene"] = 2] = "SettingScene";
    SceneName[SceneName["HighScoreScene"] = 3] = "HighScoreScene";
    SceneName[SceneName["EndScene"] = 4] = "EndScene";
})(SceneName || (SceneName = {}));
class Scene {
    constructor() {
    }
    pause() { }
    Init() { }
    update(deltaTime) { }
    exit() { }
    resume() { }
    render(Renderer) { }
}

;// ./src/Engine/Component/Component.ts
class Component {
    constructor() { }
}

;// ./src/Engine/Component/HitBox.ts

class HitBox extends Component {
    constructor(pos, width, height) {
        super();
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.active = true;
    }
    setPosition(pos) {
        this.pos = pos;
    }
    Init() { }
    update(deltaTime) { }
    getPosX() {
        return this.pos.x;
    }
    render(renderer, x, y) {
        // if(this.active)  renderer.drawRect(x, y, this.width, this.height);
    }
    getPosY() {
        return this.pos.y;
    }
    getActive() {
        return this.active;
    }
    setDeActive(hi) {
        this.active = hi;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    intersects(other) {
        if (!this.active)
            return false;
        return !(this.pos.x + this.width < other.getPosX() ||
            this.pos.x > other.getPosX() + other.getWidth() ||
            this.pos.y + this.height < other.getPosY() ||
            this.pos.y > other.getPosY() + other.getHeight());
    }
}

;// ./src/DoodleJump/Scene/Object/Platform/Platform.ts



class Platform extends GameObject {
    constructor(x, y, jumpForce = -500) {
        super({ x, y }, { width: 90, height: 15 });
        this.HitBox = new HitBox({ x, y }, 90, 15);
        this.AddComponent(this.HitBox);
        this.isActive = true;
        this.jumpForce = jumpForce;
        this.initializePlatform();
    }
    getHitBox() {
        return this.HitBox;
    }
    initializePlatform() {
        const textureName = this.getTextureName();
        this.AddImage(ResourceManager.getInstance().getTexture(textureName));
    }
    Update(deltaTime) {
        if (!this.isActive)
            return;
        this.updatePlatformSpecific(deltaTime);
        super.Update(deltaTime);
    }
    updatePlatformSpecific(deltaTime) {
    }
    onPlayerLand(player) {
        this.handlePlayerLanding();
        return this.jumpForce;
    }
    handlePlayerLanding() {
    }
    resetPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.isActive = true;
        this.HitBox.setPosition(this.position);
        this.onReset();
    }
    onReset() {
    }
    setRandomPosition(minY, maxY) {
        const newX = Math.random() * (500 - this.size.width);
        const newY = minY + Math.random() * (maxY - minY);
        this.resetPosition(newX, newY);
    }
    get isActivePlatform() {
        return this.isActive;
    }
    Render(renderer) {
        if (!this.isActive)
            return;
        //console.log('render ar', this.position)
        super.Render(renderer);
    }
}

;// ./src/Engine/ResourceManager/AudioManager.ts
class AudioManager {
    constructor() {
        this.audioCache = new Map();
    }
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
    loadSound(name, path) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        this.audioCache.set(name, audio);
    }
    playSound(name, volume = 1.0) {
        const audio = this.audioCache.get(name);
        if (audio) {
            audio.currentTime = 0; // Reset về đầu
            audio.volume = volume;
            audio.play().catch(error => {
                console.error(`Error playing sound ${name}:`, error);
            });
        }
    }
    stopSound(name) {
        const audio = this.audioCache.get(name);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

;// ./src/DoodleJump/Scene/Object/Platform/NormalPlatform.ts


class NormalPlatform extends Platform {
    constructor(x, y) {
        super(x, y, -500);
        //  console.log('normal', this.position)
    }
    getTextureName() {
        return 'platform';
    }
    handlePlayerLanding() {
        const audioManager = AudioManager.getInstance();
        audioManager.loadSound('jump', 'assets/images/jump.mp3');
        audioManager.playSound('jump', 0.8);
    }
}

;// ./src/DoodleJump/Scene/Object/Platform/SpringPlatform.ts


class SpringPlatform extends Platform {
    constructor(x, y) {
        super(x, y, -1000);
        console.log('spring', x, y);
    }
    getTextureName() {
        return 'spring';
    }
    handlePlayerLanding() {
        const audioManager = AudioManager.getInstance();
        audioManager.loadSound('jump', 'assets/images/spring.mp3');
        audioManager.playSound('jump', 0.8);
    }
}

;// ./src/DoodleJump/Scene/Object/Platform/InvisiblePlatform.ts



class InvisiblePlatform extends Platform {
    constructor(x, y, respawnTime = 2000) {
        super(x, y, -500);
        this.disappearDelay = 200;
        this.disappearTimer = 0;
        this.isTriggered = false;
        console.log('invi', x, y);
        this.respawnTime = respawnTime;
        this.respawnTimer = 0;
        this.originalY = y;
        this.beforeTexture = ResourceManager.getInstance().getTexture('before');
        this.afterTexture = ResourceManager.getInstance().getTexture('after');
    }
    getTextureName() {
        return 'before';
    }
    handlePlayerLanding() {
        if (!this.isTriggered) {
            this.triggerDisappear();
        }
        const audioManager = AudioManager.getInstance();
        audioManager.loadSound('jump', 'assets/images/break.mp3');
        audioManager.playSound('jump', 0.8);
    }
    triggerDisappear() {
        this.isTriggered = true;
        this.disappearTimer = this.disappearDelay;
    }
    Render(renderer) {
        if (!this.isActive)
            return;
        const currentTexture = this.isTriggered ? this.afterTexture : this.beforeTexture;
        renderer.render(currentTexture, this.position.x, this.position.y);
        for (const component of this._listComponent) {
            component.render(renderer, this.position.x, this.position.y);
        }
    }
    breakPlatform() {
        this.isActive = false;
        this.respawnTimer = this.respawnTime;
        this.isTriggered = false;
        this.disappearTimer = 0;
    }
    updatePlatformSpecific(deltaTime) {
        if (this.isTriggered && this.disappearTimer > 0 && this.isActive) {
            this.disappearTimer -= deltaTime * 1000;
            if (this.disappearTimer <= 0) {
                this.breakPlatform();
            }
        }
        if (!this.isActive && this.respawnTimer > 0) {
            this.respawnTimer -= deltaTime * 1000;
            if (this.respawnTimer <= 0) {
                this.respawn();
            }
        }
    }
    respawn() {
        this.isActive = true;
        this.isTriggered = false;
        this.disappearTimer = 0;
        this.position.y = this.originalY;
        this.getHitBox().setPosition(this.position);
    }
    resetPosition(x, y) {
        super.resetPosition(x, y);
        this.originalY = y;
        this.isTriggered = false;
        this.disappearTimer = 0;
    }
    onReset() {
        this.respawnTimer = 0;
        this.isTriggered = false;
        this.isActive = true;
        this.disappearTimer = 0;
        this.position.y = this.originalY;
        this.getHitBox().setPosition(this.position);
    }
}

;// ./src/DoodleJump/Scene/Object/Platform/MovingPlatform.ts


class MovingPlatform extends Platform {
    constructor(x, y, moveSpeed = 50, moveRange = 100) {
        super(x, y, -500);
        console.log('move', x, y);
        this.originalX = x;
        this.moveDirection = 1;
        this.moveSpeed = moveSpeed;
        this.moveRange = moveRange;
    }
    getTextureName() {
        return 'platform';
    }
    updatePlatformSpecific(deltaTime) {
        this.updateMovement(deltaTime);
    }
    handlePlayerLanding() {
        const audioManager = AudioManager.getInstance();
        audioManager.loadSound('jump', 'assets/images/jump.mp3');
        audioManager.playSound('jump', 0.8);
    }
    updateMovement(deltaTime) {
        this.position.x += this.moveSpeed * this.moveDirection * deltaTime;
        // Check movement bounds
        if (this.position.x <= this.originalX - this.moveRange) {
            this.moveDirection = 1;
            this.position.x = this.originalX - this.moveRange;
        }
        else if (this.position.x >= this.originalX + this.moveRange) {
            this.moveDirection = -1;
            this.position.x = this.originalX + this.moveRange;
        }
        // Check screen bounds
        if (this.position.x < 0) {
            this.position.x = 0;
            this.moveDirection = 1;
        }
        else if (this.position.x > 400 - this.size.width) {
            this.position.x = 400 - this.size.width;
            this.moveDirection = -1;
        }
        this.getHitBox().setPosition(this.position);
    }
    onReset() {
        this.originalX = this.position.x;
        this.moveDirection = 1;
    }
}

;// ./src/DoodleJump/Scene/Object/Platform/CreatePlatform.ts




class PlatformFactory {
    // static createPlatform(type: PlatformType, x: number, y: number): Platform {
    //     switch (type) {
    //         case 'normal':
    //             return new NormalPlatform(x, y);
    //         case 'spring':
    //             return new SpringPlatform(x, y);
    //         case 'moving':
    //             return new MovingPlatform(x, y);
    //         case 'invi':
    //             return new InvisiblePlatform(x, y);
    //         case 'springy':
    //             return new SpringyPlatform(x, y);
    //         default:
    //             return new NobitaPlatform(x,y);
    //     }
    // }
    static createRandomPlatform(x, y, allowSpecial = true) {
        console.log('conca', x, y);
        if (!allowSpecial) {
            return new NormalPlatform(x, y);
        }
        // return new NormalPlatform(x, y);
        const random = Math.random();
        // if (random < 0.40) {  // Giảm xuống 40%
        //     return new InvisiblePlatform(x, y)
        // } else if (random < 0.60) {  // 18% cho Spring
        //     return new SpringPlatform(x, y);
        // } else if (random < 0.75) {  // 14% cho Moving
        //     return new MovingPlatform(x, y);
        // } else if (random < 0.85) {  // 14% cho Springy
        //     return new SpringyPlatform(x, y);
        //  } else if (random < 0.92) {  // 9% cho Nobita
        //             return new NormalPlatform(x, y); 
        //  } else {  // 5% cho Invisible
        //              return new NobitaPlatform(x, y);
        if (random < 0.70) { // 70% cho Normal Platform
            //console.log('nor', x, y)
            return new NormalPlatform(x, y);
        }
        else if (random < 0.85) { // 15% cho Spring Platform (tăng tốc độ nhảy)
            //   console.log('sp', x, y)
            return new SpringPlatform(x, y);
        }
        else if (random < 0.95) { // 10% cho Moving Platform (khó hơn)
            //  console.log('concho', x, y)
            return new MovingPlatform(x, y);
        }
        else { // 5% cho Invisible Platform (khó nhất)
            // console.log('hehe', x, y)
            return new InvisiblePlatform(x, y);
        }
    }
}

;// ./src/DoodleJump/Scene/Object/Platform/PlatformManager.ts

class PlatformManager {
    constructor(player, collision) {
        this.platformList = [];
        this.PositionInit = [];
        this.PositionRecycle = [];
        this.isDelete = false;
        this.PLATFORM_COUNT = 10;
        this.PLATFORM_VERTICAL_SPACING = 115;
        this.PLATFORM_MIN_SPAWN_DISTANCE = 90;
        this.PLATFORM_MAX_SPAWN_DISTANCE = 150;
        this.SCREEN_WIDTH = 400;
        this.player = player;
        this.collision = collision;
        this.initializePositionArrays();
        this.createInitialPlatforms();
    }
    initializePositionArrays() {
        this.PositionInit = [];
        for (let i = 0; i < this.PLATFORM_COUNT; i++) {
            this.PositionInit.push({ x: 0, y: 0 });
        }
    }
    createInitialPlatforms() {
        this.platformList = [];
        for (let i = 0; i < this.PLATFORM_COUNT; i++) {
            const platform = this.createPlatformAtIndex(i);
            this.addPlatformToGame(platform);
        }
        this.highest = this.platformList[9];
    }
    createPlatformAtIndex(index) {
        if (index == 0) {
            return PlatformFactory.createRandomPlatform(200, 600, false);
        }
        const x = this.generateRandomX();
        const y = 600 + (index * -this.PLATFORM_VERTICAL_SPACING);
        this.PositionInit[index].x = x;
        this.PositionInit[index].y = y;
        return PlatformFactory.createRandomPlatform(x, y);
    }
    returnPosInit() {
        return this.PositionInit;
    }
    generateRandomX() {
        return Math.random() * this.SCREEN_WIDTH;
    }
    addPlatformToGame(platform) {
        this.collision.addHitBox(platform.getHitBox());
        this.platformList.push(platform);
    }
    deletePlatform() {
        const beforeCount = this.platformList.length;
        this.platformList = this.platformList.filter(hi => !this.isPlatformBelowScreen(hi));
        const afterCount = this.platformList.length;
        this.isDelete = beforeCount > afterCount;
    }
    update(deltaTime) {
        for (const platform of this.platformList) {
            platform.Update(deltaTime);
        }
    }
    movePlatformsDown(offset) {
        for (const platform of this.platformList) {
            platform.position.y += offset;
            platform.getHitBox().setPosition(platform.position);
        }
    }
    isPlatformBelowScreen(platform) {
        return platform.position.y > 900;
    }
    SpawnPlatform() {
        if (!this.isDelete)
            return;
        const x = this.generateRandomX();
        const y = 900 + (10 * -this.PLATFORM_VERTICAL_SPACING);
        const platform = PlatformFactory.createRandomPlatform(x, y);
        this.addPlatformToGame(platform);
        this.highest = platform;
        this.isDelete = true;
    }
    ReturnHighest() {
        return this.highest;
    }
    checkPlayerCollision(playerPhysics) {
        const playerHitbox = this.player.getHitBox();
        const collisionThreshold = 10;
        for (const platform of this.platformList) {
            if (!platform.isActivePlatform)
                continue;
            if (this.isPlayerLandingOnPlatform(playerHitbox, platform, collisionThreshold)) {
                this.handlePlayerLandingOnPlatform(platform, playerPhysics);
                return true;
            }
        }
        return false;
    }
    isPlayerLandingOnPlatform(playerHitbox, platform, threshold) {
        if (!playerHitbox.intersects(platform.getHitBox())) {
            return false;
        }
        const playerBottom = this.player.getPosition().y + this.player.getSize().height;
        const platformTop = platform.position.y;
        return Math.abs(playerBottom - platformTop) < threshold;
    }
    handlePlayerLandingOnPlatform(platform, playerPhysics) {
        const jumpForce = platform.onPlayerLand(this.player);
        playerPhysics.setVelocity({
            x: playerPhysics.getVelocity().x,
            y: jumpForce
        });
    }
    render(renderer) {
        for (const platform of this.platformList) {
            platform.Render(renderer);
        }
    }
    getPlatformCount() {
        return this.platformList.length;
    }
    getActivePlatformCount() {
        return this.platformList.filter(p => p.isActivePlatform).length;
    }
}

;// ./src/DoodleJump/Scene/Object/BoostObject/BoostObject.ts



class BoostObject extends GameObject {
    attachToPlatform(platform) {
        this.attachedPlatform = platform;
    }
    constructor(x, y, jumpForce, width, height) {
        super({ x, y }, { width: width, height: height });
        this.HitBox = new HitBox({ x, y }, width, height);
        this.AddComponent(this.HitBox);
        this.isActive = true;
        this.jumpForce = jumpForce;
        this.initializePlatform();
    }
    getHitBox() {
        return this.HitBox;
    }
    initializePlatform() {
        const textureName = this.getTextureName();
        this.AddImage(ResourceManager.getInstance().getTexture(textureName));
    }
    getAgetAttachedPlatform() {
        return this.attachedPlatform;
    }
    Update(deltaTime) {
        if (!this.isActive)
            return;
        if (this.attachedPlatform) {
            this.position.x = this.attachedPlatform.position.x;
            this.position.y = this.attachedPlatform.position.y + this.getVerticalOffset();
            this.getHitBox().setPosition(this.position);
        }
        this.updatePlatformSpecific(deltaTime);
        super.Update(deltaTime);
    }
    updatePlatformSpecific(deltaTime) {
    }
    onPlayerLand(player) {
        this.handlePlayerLanding();
        return this.jumpForce;
    }
    handlePlayerLanding() {
    }
    resetPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.isActive = true;
        this.HitBox.setPosition(this.position);
        this.onReset();
    }
    onReset() {
    }
    setRandomPositionOnPlatform(x, y) {
        this.resetPosition(x, y);
    }
    get isActivePlatform() {
        return this.isActive;
    }
    Render(renderer) {
        if (!this.isActive)
            return;
        super.Render(renderer);
    }
}

;// ./src/DoodleJump/Scene/Object/BoostObject/RocketObject.ts


class RocketObject extends BoostObject {
    constructor(x, y, jumpForce = { x: 200, y: -1500 }, width = 77, height = 100) {
        super(x, y, jumpForce, width, height);
    }
    getTextureName() {
        return 'ditconme';
    }
    getVerticalOffset() {
        return -100;
    }
    handlePlayerLanding() {
        const audioManager = AudioManager.getInstance();
        audioManager.loadSound('jump', 'assets/images/jetpack.mp3');
        audioManager.playSound('jump', 0.8);
        setTimeout(() => {
            audioManager.stopSound('jump');
        }, 1000);
    }
}

;// ./src/DoodleJump/Scene/Object/BoostObject/SpringObject.ts


class SpringObject extends BoostObject {
    constructor(x, y, jumpForce = { x: 200, y: -1000 }, width = 77, height = 32) {
        super(x, y, jumpForce, width, height);
    }
    getTextureName() {
        return 'dicho';
    }
    getVerticalOffset() {
        return -20; // Spring offset
    }
    handlePlayerLanding() {
        const audioManager = AudioManager.getInstance();
        audioManager.loadSound('jump', 'assets/images/spring.mp3');
        audioManager.playSound('jump', 0.8);
    }
}

;// ./src/DoodleJump/Scene/Object/BoostObject/BoostFactory.ts


class BoostFactory {
    static createRandomBoost(x, y) {
        const random = Math.random();
        if (random < 0.6) {
            return new SpringObject(x, y, { x: 0, y: -1000 }, 77, 32);
        }
        else {
            return new RocketObject(x, y, { x: 0, y: -1500 }, 77, 50);
        }
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // } else if (random < 0.85) {  // 15% cho Rocket (cần implement)
        //     // return new RocketObject(x, y);
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // } else if (random < 0.95) {  // 10% cho Jetpack (cần implement)
        //     // return new JetpackObject(x, y);
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // } else {  // 5% cho Shield (cần implement)
        //     // return new ShieldObject(x, y);
        //         return new SpringObject(x, y,{x:-20,y:-1000},80,130);
        // }
    }
}

;// ./src/DoodleJump/Scene/Object/BoostObject/BoostManager.ts

class BoostManager {
    constructor(player, collision, highestNumber) {
        this.boostList = [];
        this.BASE_BOOST_COUNT = 1;
        this.BASE_BOOST_SPAWN_CHANCE = 1;
        this.player = player;
        this.collision = collision;
        this.highestNumber = highestNumber;
    }
    createBoostOnPlatform() {
        if (this.boostList.length <= 0) {
            const boostX = this.highestNumber.position.x;
            const boostY = this.highestNumber.position.y;
            const boost = BoostFactory.createRandomBoost(boostX, boostY);
            boost.attachToPlatform(this.highestNumber);
            this.addBoostToGame(boost);
        }
    }
    //     public createBoostOnPlatform(): void {
    //     // Kiểm tra xem có boost nào đang ở gần platform cao nhất không
    //     const PROXIMITY_THRESHOLD = 50; // pixels
    //     const hasNearbyBoost = this.boostList.some(boost => 
    //         Math.abs(boost.position.y - this.highestNumber.position.y) < PROXIMITY_THRESHOLD
    //     );
    //     if (!hasNearbyBoost) {
    //         const boostX = this.highestNumber.position.x;
    //         const boostY = this.highestNumber.position.y; 
    //         const boost = BoostFactory.createRandomBoost(boostX, boostY);
    //         console.log('create new boost');
    //         boost.attachToPlatform(this.highestNumber);
    //         this.addBoostToGame(boost);
    //     }
    // }
    addBoostToGame(boost) {
        this.collision.addHitBox(boost.getHitBox());
        this.boostList.push(boost);
    }
    update(deltaTime) {
        for (const boost of this.boostList) {
            boost.Update(deltaTime);
        }
    }
    moveBoostsDown(offset) {
        for (const boost of this.boostList) {
            boost.position.y += offset;
            boost.getHitBox().setPosition(boost.position);
        }
    }
    setHighest(hi) {
        this.highestNumber = hi;
    }
    handleBoostRecycling() {
        this.boostList = this.boostList.filter(boost => !this.isBoostBelowScreen(boost));
    }
    isBoostBelowScreen(boost) {
        return boost.position.y > 900;
    }
    checkPlayerCollision() {
        const playerHitbox = this.player.getHitBox();
        for (let i = this.boostList.length - 1; i >= 0; i--) {
            const boost = this.boostList[i];
            if (!boost.isActivePlatform)
                continue;
            if (playerHitbox.intersects(boost.getHitBox())) {
                this.applyBoostEffect(boost);
                // Remove boost after collection
                this.boostList.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    applyBoostEffect(boost) {
        const baseJumpForce = boost.onPlayerLand(this.player);
        const playerPhysics = this.player.getPhysics();
        if (playerPhysics) {
            playerPhysics.setVelocity(baseJumpForce);
        }
        console.log('Boost collected!', boost.constructor.name);
    }
    render(renderer) {
        for (const boost of this.boostList) {
            boost.Render(renderer);
        }
    }
    reset() {
        this.boostList = [];
    }
    getBoostCount() {
        return this.boostList.length;
    }
    getActiveBoostCount() {
        return this.boostList.filter(b => b.isActivePlatform).length;
    }
}

;// ./src/Engine/Component/Animation.ts

class Animation extends Component {
    Init() {
    }
    constructor() {
        super();
        this.numFrame = { x: 1, y: 1 }; // Default value
        this.totalFrames = 1;
        this.currentFrame = 0;
        this.frameTime = 0;
        this.clock = 0;
    }
    setFrameTime(frameTime) {
        this.frameTime = frameTime;
    }
    setNumframe(numFrame) {
        this.numFrame = numFrame;
        this.updateFrameParams();
    }
    updateFrameParams() {
        if (this.texture && this.numFrame) {
            this.frameParam = {
                x: Math.floor(this.texture.width / this.numFrame.x),
                y: Math.floor(this.texture.height / this.numFrame.y)
            };
            this.totalFrames = this.numFrame.x * this.numFrame.y;
            // console.log('Updated frameParam:', this.frameParam, 'totalFrames:', this.totalFrames);
        }
    }
    update(deltaTime) {
        if (this.frameTime > 0) {
            this.clock += deltaTime;
            if (this.clock >= this.frameTime) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                this.clock -= this.frameTime;
            }
        }
    }
    render(renderer, x, y) {
        // Kiểm tra texture trước khi render
        if (!this.texture || !this.texture.complete || this.texture.naturalWidth === 0) {
            return; // Skip render nếu texture chưa ready
        }
        const fx = this.currentFrame % this.numFrame.x;
        const fy = Math.floor(this.currentFrame / this.numFrame.x);
        renderer.drawFrame(this.texture, fx * this.frameParam.x, fy * this.frameParam.y, this.frameParam.x, this.frameParam.y, x, y, this.frameParam.x, this.frameParam.y);
    }
    setTexture(texture) {
        //  console.log('Setting new texture:', texture ? texture.src : 'null');
        this.texture = texture;
        this.updateFrameParams();
        this.reset();
    }
    reset() {
        this.currentFrame = 0;
        this.clock = 0;
    }
    // Debug method
    getCurrentTexture() {
        return this.texture;
    }
}

;// ./src/Engine/Component/Physic2D.ts

class Physic2D extends Component {
    constructor(position, GameObject, velocity = { x: 0, y: 0 }, acceleration = { x: 0, y: 0 }, gravity = 980, useGravity = true) {
        super();
        this.reverseGravity = false;
        this.totalTime = 0;
        this.GameObject = GameObject;
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.gravity = gravity;
        this.useGravity = useGravity;
        this.startY = position.y;
        this.startX = position.x;
    }
    Init() {
    }
    setReverse(hi) {
        this.reverseGravity = hi;
    }
    update(deltaTime) {
        if (!this.reverseGravity) {
            this.velocity.y += this.gravity * deltaTime;
            this.position.x += this.velocity.x * deltaTime;
            this.position.y += this.velocity.y * deltaTime;
            this.GameObject.setPosition(this.position);
        }
        else {
            this.velocity.y += this.gravity * deltaTime;
            this.position.x += this.velocity.x * deltaTime;
            this.position.y -= this.velocity.y * deltaTime;
        }
    }
    render() {
    }
    getVelocity() {
        return this.velocity;
    }
    getPosition() {
        return this.position;
    }
    setPosition(pos) {
        this.position = pos;
    }
    setVelocity(vel) {
        this.velocity = vel;
    }
    setAcceleration(acc) {
        this.acceleration = acc;
    }
    setGravity(g) {
        this.gravity = g;
    }
    enableGravity(enable) {
        this.useGravity = enable;
    }
    addForce(force) {
        this.velocity.x += force.x;
        this.velocity.y += force.y;
    }
}

;// ./src/Engine/InputHandle/InputHandle.ts
class InputHandle {
    static initialize(canvas) {
        InputHandle.canvas = canvas;
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            InputHandle.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        });
        canvas.addEventListener('mousedown', () => {
            InputHandle.mouseDown = true;
        });
        canvas.addEventListener('mouseup', () => {
            InputHandle.mouseDown = false;
        });
        window.addEventListener('keydown', (e) => {
            InputHandle.keys.add(e.key.toLowerCase());
        });
        window.addEventListener('keyup', (e) => {
            InputHandle.keys.delete(e.key.toLowerCase());
        });
    }
    static isKeyDown(key) {
        return InputHandle.keys.has(key.toLowerCase());
    }
    static getMouse() {
        return InputHandle.mouse;
    }
    static isMouseDown() {
        return InputHandle.mouseDown;
    }
}
InputHandle.keys = new Set();
InputHandle.mouse = { x: 0, y: 0 };
InputHandle.mouseDown = false;
InputHandle.canvas = null;

;// ./src/DoodleJump/Scene/Object/Player/DoodleJump.ts


class DoodleJump {
    constructor(player) {
        this.SCREEN_WIDTH = 400;
        this.MOVE_SPEED = 300;
        this.Player = player;
        this.Animation = this.Player.getAni();
    }
    Init() {
        this.setJumpTexture();
    }
    setJumpTexture() {
        if (this.Animation) {
            const texture = this.Player.getIsLeft() ? 'jump-left' : 'jump-right';
            this.Animation.setTexture(ResourceManager.getInstance().getTexture(texture));
            this.Animation.setNumframe({ x: 1, y: 1 });
            this.Animation.setFrameTime(0);
        }
    }
    flip() {
        this.setJumpTexture();
    }
    handleInput() {
        const currentVelocity = this.Player.getPhysics().getVelocity();
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Player.setLeft(false);
            this.Player.getPhysics().setVelocity({
                x: this.MOVE_SPEED,
                y: currentVelocity.y
            });
            if (this.Animation) {
                this.Animation.setTexture(ResourceManager.getInstance().getTexture('jump-right'));
            }
        }
        else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -this.MOVE_SPEED,
                y: currentVelocity.y
            });
            if (this.Animation) {
                this.Animation.setTexture(ResourceManager.getInstance().getTexture('jump-left'));
            }
        }
        else {
            this.Player.getPhysics().setVelocity({
                x: 0,
                y: currentVelocity.y
            });
            this.setJumpTexture();
        }
    }
    Update(deltaTime) {
        this.updateBoundaries();
        this.handleInput();
        this.Player.getGameObject().Update(deltaTime);
    }
    Render(Renderer) {
        this.Player.getGameObject().Render(Renderer);
    }
    updateBoundaries() {
        const playerWidth = this.Player.getGameObject().size.width;
        const position = this.Player.getGameObject().position;
        if (position.x > this.SCREEN_WIDTH + playerWidth) {
            this.Player.setPosition(0, position.y);
        }
        else if (position.x < -playerWidth) {
            this.Player.setPosition(this.SCREEN_WIDTH, position.y);
        }
    }
}

;// ./src/DoodleJump/Scene/Object/Player/DoodleLanding.ts


class DoodleLanding {
    constructor(player) {
        this.SIZE = { width: 40, height: 40 };
        this.SCREEN_WIDTH = 400;
        this.Player = player;
        this.Animation = this.Player.getAni();
    }
    Init() {
        this.setLandingTexture();
    }
    setLandingTexture() {
        if (this.Player.getIsLeft()) {
            this.Animation.setTexture(ResourceManager.getInstance().getTexture('touch-left'));
        }
        else {
            this.Animation.setTexture(ResourceManager.getInstance().getTexture('touch-right'));
        }
        this.Animation.setNumframe({ x: 1, y: 1 });
        this.Animation.setFrameTime(0);
    }
    handleInput() {
        const currentVelocity = this.Player.getPhysics().getVelocity();
        const animation = this.Animation;
        if (!animation) {
            return;
        }
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Player.setLeft(false);
            this.Player.getPhysics().setVelocity({
                x: 300,
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('touch-right'));
            animation.setNumframe({ x: 1, y: 1 });
            animation.setFrameTime(0);
        }
        else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -300,
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('touch-left'));
            animation.setNumframe({ x: 1, y: 1 });
            animation.setFrameTime(0);
        }
        else {
            this.Player.setLeft(this.Player.getIsLeft());
            this.Player.getPhysics().setVelocity({
                x: 0,
                y: currentVelocity.y
            });
            this.setLandingTexture();
        }
    }
    Update(deltaTime) {
        if (this.Player.getVelocity().y > -500) {
            this.Player.changeState(this.Player.getJumpingState());
        }
        this.handleInput();
        this.updateBoundaries();
        this.Player.getGameObject().Update(deltaTime);
        if (this.Player.getRocket()) {
            this.Player.setRocket(false);
            this.Player.changeState(this.Player.getRocketState());
        }
        if (!this.Player.getLanding()) {
            this.Player.changeState(this.Player.getJumpingState());
        }
    }
    flip() {
        const animation = this.Animation;
        if (!animation) {
            return;
        }
        switch (this.Player.getIsLeft()) {
            case true:
                animation.setTexture(ResourceManager.getInstance().getTexture('touch-left'));
                break;
            case false:
                animation.setTexture(ResourceManager.getInstance().getTexture('touch-right'));
                break;
        }
    }
    Render(Renderer) {
        this.Player.getGameObject().Render(Renderer);
    }
    updateBoundaries() {
        const playerWidth = this.Player.getGameObject().size.width;
        if (this.Player.getGameObject().position.x > this.SCREEN_WIDTH + playerWidth) {
            this.setPosition(0, this.Player.getGameObject().position.y);
        }
        else if (this.Player.getGameObject().position.x < -playerWidth) {
            this.setPosition(this.SCREEN_WIDTH, this.Player.getGameObject().position.y);
        }
    }
    setPosition(x, y) {
        this.Player.getGameObject().position.x = x;
        this.Player.getGameObject().position.y = y;
        this.Player.getPhysics().setPosition({ x, y });
    }
    resetPosition() {
        this.setPosition(200, 300);
        this.Player.getPhysics().setVelocity({ x: 0, y: 0 });
    }
}

;// ./src/DoodleJump/Scene/Object/Player/DoodleRocket.ts


class DoodleRocket {
    constructor(player) {
        this.SCREEN_WIDTH = 400;
        this.animationSetup = false;
        this.rocketTimer = 0;
        this.ROCKET_DURATION = 1;
        this.Player = player;
        this.Animation = this.Player.getAni();
    }
    Init() {
        this.setupRocketAnimation();
        this.animationSetup = true;
        this.rocketTimer = 0;
    }
    setupRocketAnimation() {
        const animation = this.Animation;
        if (!animation) {
            console.warn('Animation component not available in DoodleRocket');
            return;
        }
        animation.setTexture(ResourceManager.getInstance().getTexture('rocket'));
        animation.setNumframe({ x: 3, y: 3 });
        animation.setFrameTime(0.1);
    }
    handleInput() {
        const currentVelocity = this.Player.getPhysics().getVelocity();
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Player.setLeft(false);
            this.Player.getPhysics().setVelocity({
                x: 300,
                y: currentVelocity.y
            });
            console.log('Rocket moving right');
        }
        else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -300,
                y: currentVelocity.y
            });
        }
        else {
            this.Player.setLeft(this.Player.getIsLeft());
            this.Player.getPhysics().setVelocity({
                x: 0,
                y: currentVelocity.y
            });
        }
    }
    Update(deltaTime) {
        if (!this.animationSetup) {
            this.setupRocketAnimation();
            this.animationSetup = true;
            this.rocketTimer = 0;
        }
        this.Player.getGameObject().activeHitbox(false);
        this.rocketTimer += deltaTime;
        this.updateBoundaries();
        this.handleInput();
        this.Player.getGameObject().Update(deltaTime);
        this.checkStateTransition();
    }
    checkStateTransition() {
        if (this.rocketTimer >= this.ROCKET_DURATION) {
            this.Player.getGameObject().activeHitbox(true);
            this.Player.setRocket(false);
            this.animationSetup = false;
            this.rocketTimer = 0; // Reset timer
            if (this.Player.getLanding())
                this.Player.changeState(this.Player.getLandingState());
            else {
                this.Player.changeState(this.Player.getJumpingState());
            }
        }
    }
    Render(Renderer) {
        this.Player.getGameObject().Render(Renderer);
    }
    updateBoundaries() {
        const playerWidth = this.Player.getGameObject().size.width;
        if (this.Player.getGameObject().position.x > this.SCREEN_WIDTH + playerWidth) {
            this.setPosition(0, this.Player.getGameObject().position.y);
        }
        else if (this.Player.getGameObject().position.x < -playerWidth) {
            this.setPosition(this.SCREEN_WIDTH, this.Player.getGameObject().position.y);
        }
    }
    setPosition(x, y) {
        this.Player.getGameObject().position.x = x;
        this.Player.getGameObject().position.y = y;
        this.Player.getPhysics().setPosition({ x, y });
    }
    resetPosition() {
        this.setPosition(200, 300);
        this.Player.getPhysics().setVelocity({ x: 0, y: 0 });
    }
}

;// ./src/DoodleJump/Scene/Object/Player/DoodleSpring.ts


class DoodleSpring {
    constructor(player) {
        this.SCREEN_WIDTH = 400;
        this.MOVE_SPEED = 300;
        this.SPRING_VELOCITY_THRESHOLD = -1000; // Spring effect threshold
        this.Player = player;
        this.Animation = this.Player.getAni();
    }
    Init() {
        console.log('g');
        this.setJumpTexture();
        // Reset spring flag after initialization
        this.Player.setString(false);
    }
    setJumpTexture() {
        const animation = this.Animation;
        if (!animation) {
            console.warn('Animation component not available in DoodleSpring');
            return;
        }
        const texture = this.Player.getIsLeft() ? 'jump-left' : 'jump-right';
        animation.setTexture(ResourceManager.getInstance().getTexture(texture));
        animation.setNumframe({ x: 1, y: 1 });
        animation.setFrameTime(0);
    }
    flip() {
        this.setJumpTexture();
    }
    handleInput() {
        const currentVelocity = this.Player.getPhysics().getVelocity();
        const animation = this.Animation;
        if (!animation) {
            return;
        }
        if (InputHandle.isKeyDown('ArrowRight')) {
            this.Player.setLeft(false);
            this.Player.getPhysics().setVelocity({
                x: this.MOVE_SPEED,
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('jump-right'));
        }
        else if (InputHandle.isKeyDown('ArrowLeft')) {
            this.Player.setLeft(true);
            this.Player.getPhysics().setVelocity({
                x: -this.MOVE_SPEED,
                y: currentVelocity.y
            });
            animation.setTexture(ResourceManager.getInstance().getTexture('jump-left'));
        }
        else {
            this.Player.getPhysics().setVelocity({
                x: 0,
                y: currentVelocity.y
            });
            this.setJumpTexture();
        }
    }
    Update(deltaTime) {
        this.Player.getGameObject().activeHitbox(false);
        this.updateBoundaries();
        this.handleInput();
        this.Player.getGameObject().Update(deltaTime);
    }
    Render(Renderer) {
        this.Player.getGameObject().Render(Renderer);
    }
    updateBoundaries() {
        const playerWidth = this.Player.getGameObject().size.width;
        const position = this.Player.getGameObject().position;
        if (position.x > this.SCREEN_WIDTH + playerWidth) {
            this.Player.setPosition(0, position.y);
        }
        else if (position.x < -playerWidth) {
            this.Player.setPosition(this.SCREEN_WIDTH, position.y);
        }
    }
}

;// ./src/DoodleJump/Scene/Object/Player/Player.ts








class Player {
    constructor() {
        this.isLanding = false;
        this.isString = false;
        this.isRocketActive = false;
        this.FIXED_Y = 300;
        this.SIZE = { width: 40, height: 40 };
        this.isLeft = false;
        this.gameObject = new GameObject({ x: 200, y: this.FIXED_Y }, this.SIZE);
        this.Animation = new Animation();
        this.HitBox = new HitBox({ x: 200, y: this.FIXED_Y }, this.SIZE.width, this.SIZE.height);
        this.physics = new Physic2D({ x: 200, y: this.FIXED_Y }, this.gameObject);
        this.gameObject.AddComponent(this.Animation);
        this.gameObject.AddComponent(this.HitBox);
        this.gameObject.AddComponent(this.physics);
        this.JumpingState = new DoodleJump(this);
        this.LandingState = new DoodleLanding(this);
        this.SpringState = new DoodleSpring(this);
        this.RocketState = new DoodleRocket(this);
    }
    Init() {
        console.log('duma');
        this.JumpingState.Init();
        this.LandingState.Init();
        this.SpringState.Init();
        this.current_state = this.JumpingState;
        console.log('ditme');
    }
    getAni() {
        return this.Animation;
    }
    changeState(newState) {
        this.current_state = newState;
        this.current_state.Init();
    }
    update(deltaTime) {
        const velocity = this.getVelocity();
        if (velocity.y > -500) {
            this.getGameObject().activeHitbox(true);
            this.changeState(this.JumpingState);
        }
        else {
            if (velocity.y === -500) {
                this.changeState(this.LandingState);
            }
            else if (velocity.y === -1500) {
                console.log('Switching to SpringState - hello');
                this.changeState(this.RocketState);
            }
            else if (velocity.y === -1000) {
                this.changeState(this.SpringState);
            }
        }
        this.current_state.Update(deltaTime);
    }
    render(renderer) {
        this.current_state.Render(renderer);
    }
    // Getters
    getIsLeft() { return this.isLeft; }
    getLanding() { return this.isLanding; }
    getString() { return this.isString; }
    getRocket() { return this.isRocketActive; }
    getGameObject() { return this.gameObject; }
    getPhysics() { return this.physics; }
    getHitBox() { return this.HitBox; }
    getPosition() { return this.gameObject.position; }
    getSize() { return this.gameObject.size; }
    getVelocity() { return this.physics.getVelocity(); }
    getJumpingState() { return this.JumpingState; }
    getLandingState() { return this.LandingState; }
    getStringState() { return this.SpringState; }
    getRocketState() { return this.RocketState; }
    setLeft(value) { this.isLeft = value; }
    setLanding(value) { this.isLanding = value; }
    setString(value) { this.isString = value; }
    setRocket(value) { this.isRocketActive = value; }
    setPosition(x, y) {
        this.gameObject.position.x = x;
        this.gameObject.position.y = y;
        this.physics.setPosition({ x, y });
    }
    resetPosition() {
        this.setPosition(200, 300);
        this.physics.setVelocity({ x: 0, y: 0 });
    }
}

;// ./src/Engine/Component/Button.ts


class Button extends GameObject {
    constructor(size, pos) {
        super(pos, { width: size.x, height: size.y });
        this.wasMouseDownLastFrame = false;
        this.cooldownTimer = 0;
        this.isPressed = false;
    }
    Init() { }
    setOnClick(callback) {
        this.onClickCallback = callback;
    }
    resetState() {
        this.wasMouseDownLastFrame = false;
        this.isPressed = false;
        // this.cooldownTimer = 0.2; 
    }
    isMouseInside(mouse) {
        return (mouse.x >= this.position.x &&
            mouse.x <= this.position.x + this.size.width &&
            mouse.y >= this.position.y &&
            mouse.y <= this.position.y + this.size.height);
    }
    Update(deltaTime) {
        // Giảm cooldown timer
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
        }
        const mouse = InputHandle.getMouse();
        const isMouseDown = InputHandle.isMouseDown();
        const mouseInside = this.isMouseInside(mouse);
        const isClicked = !this.wasMouseDownLastFrame &&
            isMouseDown &&
            mouseInside &&
            this.cooldownTimer <= 0;
        if (isClicked && this.onClickCallback) {
            this.onClickCallback();
            this.cooldownTimer = 0.2; // Set cooldown after click
        }
        // Update state for next frame
        this.wasMouseDownLastFrame = isMouseDown;
        this.isPressed = isMouseDown && mouseInside;
    }
    isButtonPressed() {
        return this.isPressed;
    }
}

;// ./src/Engine/GameScene/Scene/SceneManager.ts
class SceneManager {
    constructor() {
        this.currentScene = null;
        this.sceneMap = new Map();
        this.initializedScenes = new Set();
    }
    static getInstance() {
        if (!SceneManager.instance) {
            SceneManager.instance = new SceneManager();
        }
        return SceneManager.instance;
    }
    AddScene(name, scene) {
        console.log(`SceneManager: Adding scene "${name}"`);
        this.sceneMap.set(name, scene);
    }
    getScene(name) {
        return this.sceneMap.get(name);
    }
    changeScene(scene) {
        var _a;
        console.log('SceneManager: Changing scene...');
        if (this.currentScene == null) {
            this.currentScene = scene;
        }
        else {
            (_a = this.currentScene) === null || _a === void 0 ? void 0 : _a.exit();
            this.currentScene = scene;
        }
    }
    changeSceneByName(name) {
        console.log(`SceneManager: Changing to scene "${name}"`);
        const scene = this.getScene(name);
        if (scene) {
            this.changeScene(scene);
            if (!this.initializedScenes.has(name)) {
                console.log(`SceneManager: Initializing scene "${name}" for the first time`);
                scene.Init();
                this.initializedScenes.add(name);
            }
            else {
                console.log(`SceneManager: Scene "${name}" already initialized`);
            }
        }
        else {
            console.warn(`Scene "${name}" not found in sceneMap.`);
        }
    }
    getCurrentScene() {
        return this.currentScene;
    }
    getCurrentSceneByName() {
        for (const [name, scene] of this.sceneMap.entries()) {
            if (scene === this.currentScene) {
                return name;
            }
        }
        return "";
    }
}

;// ./src/DoodleJump/Scene/EndScene.ts




class EndScene extends Scene {
    constructor() {
        super();
        this.currentScore = 0;
        this.highScore = 0;
        this.gameOverText = "GAME OVER";
        // Fixed values
        this.screenWidth = 500;
        this.screenHeight = 750;
        this.loadResources();
        this.createButtons();
    }
    loadResources() {
        ResourceManager.getInstance().addTexture('background');
        ResourceManager.getInstance().addTexture('play');
        this.backgroundImage = ResourceManager.getInstance().getTexture('background');
    }
    createButtons() {
        const buttonWidth = 120;
        const buttonHeight = 40;
        // Restart Button
        this.restartButton = new Button({ x: buttonWidth, y: buttonHeight }, {
            x: this.screenWidth / 2 - buttonWidth / 2,
            y: this.screenHeight / 2 + 100
        });
        this.restartButton.setOnClick(() => this.onRestartClicked());
        // Menu Button
        this.menuButton = new Button({ x: buttonWidth, y: buttonHeight }, {
            x: this.screenWidth / 2 - buttonWidth / 2,
            y: this.screenHeight / 2 + 160
        });
        this.menuButton.setOnClick(() => this.onMenuClicked());
    }
    setScores(currentScore, highScore) {
        this.currentScore = currentScore;
        this.highScore = highScore;
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
        }
    }
    saveHighScore() {
        localStorage.setItem('doodleJump_highScore', this.highScore.toString());
    }
    loadHighScore() {
        const saved = localStorage.getItem('doodleJump_highScore');
        return saved ? parseInt(saved) : 0;
    }
    Init() {
        this.highScore = Math.max(this.highScore, this.loadHighScore());
    }
    update(deltaTime) {
        // Update buttons
        this.restartButton.Update(deltaTime);
        this.menuButton.Update(deltaTime);
    }
    render(renderer) {
        // Render background
        if (this.backgroundImage && this.backgroundImage.complete) {
            renderer.render(this.backgroundImage, 0, 0);
        }
        renderer.fillRect(0, 0, this.screenWidth, this.screenHeight, 'rgba(0, 0, 0, 0.7)');
        const gameOverY = this.screenHeight / 2 - 150;
        renderer.drawText(this.gameOverText, this.screenWidth / 2, gameOverY, "48px Arial", "center", "white");
        // Render Current Score
        const currentScoreY = this.screenHeight / 2 - 80;
        renderer.drawText(`Score: ${Math.floor(this.currentScore)}`, this.screenWidth / 2, currentScoreY, "32px Arial", "center", "yellow");
        // Render High Score
        const highScoreY = this.screenHeight / 2 - 40;
        renderer.drawText(`Best: ${Math.floor(this.highScore)}`, this.screenWidth / 2, highScoreY, "28px Arial", "center", "orange");
        this.renderSimpleButton(renderer, this.menuButton, "MENU");
    }
    renderSimpleButton(renderer, button, text) {
        const pos = button.position;
        const size = button.size;
        renderer.fillRect(pos.x, pos.y, size.width, size.height, '#666666');
        renderer.drawRect(pos.x, pos.y, size.width, size.height);
        renderer.drawText(text, pos.x + size.width / 2, pos.y + size.height / 2 + 6, "16px Arial", "center", "white");
    }
    onRestartClicked() {
        console.log('Restart game clicked');
        SceneManager.getInstance().changeSceneByName('PlayScene');
    }
    onMenuClicked() {
        window.location.reload();
    }
    pause() {
        console.log('EndScene paused');
    }
    resume() {
        console.log('EndScene resumed');
    }
    exit() {
        console.log('EndScene exited');
    }
}

;// ./src/DoodleJump/Scene/Play.ts








class PlayScene extends Scene {
    constructor() {
        super();
        this.currentScore = 0;
        this.highScore = 0;
        this.isGameOver = false;
        // Boost spawn tracking
        this.lastBoostSpawnScore = 0;
        this.boostSpawnInterval = 200;
        this.initializeComponents();
        this.platformManager = new PlatformManager(this.player, this.collision);
        this.boostManager = new BoostManager(this.player, this.collision, this.platformManager.ReturnHighest());
        this.endScene = new EndScene();
        this.loadHighScore();
    }
    loadHighScore() {
        const savedHighScore = localStorage.getItem('doodleJump_highScore');
        if (savedHighScore) {
            this.highScore = parseInt(savedHighScore);
        }
    }
    saveHighScore() {
        localStorage.setItem('doodleJump_highScore', this.highScore.toString());
    }
    saveCurrentScore() {
        localStorage.setItem('doodleJumpCurrentScore', this.currentScore.toString());
    }
    initializeComponents() {
        // Initialize collision system
        this.collision = new Collision();
        // Initialize player
        this.player = new Player();
        console.log('hi', this.player.getPosition());
        // Initialize background
        this.background = new GameObject({ x: 0, y: 0 }, { width: 900, height: 900 });
    }
    Init() {
        this.player.Init();
        this.collision.addHitBox(this.player.getHitBox());
        this.background.AddImage(ResourceManager.getInstance().getTexture('background'));
        this.loadHighScore();
        this.boostManager.createBoostOnPlatform();
    }
    update(deltaTime) {
        if (this.isGameOver) {
            this.endScene.update(deltaTime);
            return;
        }
        this.handleCollisions();
        this.updateGameObjects(deltaTime);
        this.handleCameraFollow();
        this.DeleteAndSpawn();
        this.player.update(deltaTime);
        this.checkGameOver();
    }
    DeleteAndSpawn() {
        this.platformManager.deletePlatform();
        this.platformManager.SpawnPlatform();
        this.boostManager.setHighest(this.platformManager.ReturnHighest());
        // console.log( 'thuchode',this.platformManager.ReturnHighest().position.y);
        this.boostManager.handleBoostRecycling();
        this.boostManager.createBoostOnPlatform();
    }
    updateGameObjects(deltaTime) {
        this.platformManager.update(deltaTime);
        this.boostManager.update(deltaTime);
    }
    handleCameraFollow() {
        const playerPosition = this.player.getPosition();
        const playerVelocity = this.player.getVelocity();
        const playerFixedY = 300;
        if (playerPosition.y < playerFixedY && playerVelocity.y < 0) {
            const cameraOffset = playerFixedY - playerPosition.y;
            this.platformManager.movePlatformsDown(cameraOffset);
            this.boostManager.moveBoostsDown(cameraOffset);
            this.player.setPosition(playerPosition.x, playerFixedY);
            this.updateScore(cameraOffset);
        }
    }
    updateScore(offset) {
        this.currentScore += offset;
        if (Math.floor(this.currentScore) > this.highScore) {
            this.highScore = Math.floor(this.currentScore);
        }
    }
    handleCollisions() {
        this.platformManager.checkPlayerCollision(this.player.getPhysics());
        if (this.platformManager.checkPlayerCollision(this.player.getPhysics()))
            console.log('i love u');
        this.boostManager.checkPlayerCollision();
    }
    checkGameOver() {
        if (this.player.getPosition().y > 700) {
            this.handleGameOver();
        }
    }
    handleGameOver() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            this.saveHighScore();
            this.endScene.setScores(this.currentScore, this.highScore);
            this.endScene.Init();
            console.log('Game Over! Score:', Math.floor(this.currentScore), 'High Score:', this.highScore);
        }
    }
    exit() {
        this.resetPlayerState();
        //  this.platformManager.reset();
        this.boostManager.reset(); // Reset boosts
        this.resetGameState();
    }
    resetPlayerState() {
        this.player.resetPosition();
    }
    resetGameState() {
        this.currentScore = 0;
        this.lastBoostSpawnScore = 0;
    }
    render(renderer) {
        // Render game objects
        this.background.Render(renderer);
        this.platformManager.render(renderer);
        this.boostManager.render(renderer);
        this.player.render(renderer);
        if (!this.isGameOver) {
            const scoreText = `Score: ${Math.floor(this.currentScore)}`;
            renderer.drawText(scoreText, 250, 50, "40px Arial", "center", "Black");
        }
        // Render EndScene nếu game over
        if (this.isGameOver) {
            this.endScene.render(renderer);
        }
    }
    getCurrentScore() {
        return Math.floor(this.currentScore);
    }
    getHighScore() {
        return this.highScore;
    }
    getPlatformCount() {
        return this.platformManager.getPlatformCount();
    }
    getActivePlatformCount() {
        return this.platformManager.getActivePlatformCount();
    }
    getBoostCount() {
        return this.boostManager.getBoostCount();
    }
    restartGame() {
        this.isGameOver = false;
        this.currentScore = 0;
        this.lastBoostSpawnScore = 0;
        // Reset player
        this.resetPlayerState();
        // Reset managers
        this.boostManager.reset();
        this.resetGameState();
        // Recreate managers với fresh state
        this.platformManager = new PlatformManager(this.player, this.collision);
        this.boostManager = new BoostManager(this.player, this.collision, this.platformManager.ReturnHighest());
        console.log('Game restarted!');
    }
}

;// ./src/DoodleJump/Scene/ListObject.ts






class ListObject {
    constructor() {
        this.listGame = [];
        this.isJump = false;
        this.Background = new GameObject({ x: 0, y: 0 }, { width: 900, height: 900 });
        this.Player = new GameObject({ x: 80, y: 480 }, { width: 60, height: 60 });
        this.PlayerHitbox = new HitBox({ x: 80, y: 480 }, 60, 60);
        this.base = new GameObject({ x: 80, y: 540 }, { width: 60, height: 20 });
        this.baseHitbox = new HitBox({ x: 80, y: 540 }, 60, 20);
        this.Player.AddComponent(this.PlayerHitbox);
        this.base.AddComponent(this.baseHitbox);
        this.Collision = new Collision();
        this.Physic2D = new Physic2D({ x: 80, y: 480 }, this.Player);
        this.Player.AddComponent(this.Physic2D);
        this.listGame.push(this.Player);
        this.listGame.push(this.base);
    }
    Init() {
        this.anim1 = new Animation();
        this.anim1.setNumframe({ x: 1, y: 1 });
        this.anim1.setFrameTime(0);
        this.listGame.push(this.Background);
        this.Player.AddComponent(this.anim1);
        this.Collision.addHitBox(this.PlayerHitbox);
        this.Collision.addHitBox(this.baseHitbox);
    }
    concac() {
        this.anim1.setTexture(ResourceManager.getInstance().getTexture('jump-left'));
        this.Background.AddImage(ResourceManager.getInstance().getTexture('loading'));
    }
    update(deltaTime) {
        for (const game of this.listGame) {
            game.Update(deltaTime);
        }
        if (this.Collision.check()) {
            if (!this.isJump) {
                this.Physic2D.setVelocity({ x: 0, y: -500 });
                this.isJump = true;
            }
        }
        else {
            this.isJump = false;
        }
    }
    render(Renderer) {
        var _a;
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
            (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.drawImage(bgImg, offsetX, offsetY, drawW, drawH);
        }
        for (const game of this.listGame) {
            if (game !== this.Background) {
                game.Render(Renderer);
            }
        }
    }
}

;// ./src/DoodleJump/Scene/Dashboard.ts





class DashboardScene extends Scene {
    constructor() {
        super();
        this.lastScore = 0;
        this.highScore = 0;
        this.isFirstLoad = true;
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
    exit() {
        console.log('Exiting Dashboard Scene');
    }
    Init() {
        this.Butt.AddImage(ResourceManager.getInstance().getTexture('play'));
        this.loadScores();
        this.ListObject.concac();
        this.isFirstLoad = false;
    }
    loadScores() {
        const savedHighScore = localStorage.getItem('doodleJump_highScore');
        if (savedHighScore) {
            this.highScore = parseInt(savedHighScore);
        }
        const savedCurrentScore = localStorage.getItem('doodleJumpCurrentScore');
        if (savedCurrentScore) {
            this.lastScore = parseInt(savedCurrentScore);
        }
    }
    update(deltaTime) {
        this.ListObject.update(deltaTime);
        this.Butt.Update(deltaTime);
    }
    render(renderer) {
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

;// ./src/DoodleJump/Scene/LoadingScene.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class LoadingScene extends Scene {
    constructor() {
        super();
        this.loadingComplete = false;
        this.assetsToLoad = [];
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
    Init() {
        this.startLoading();
    }
    startLoading() {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceManager = ResourceManager.getInstance();
            for (const assetName of this.assetsToLoad) {
                resourceManager.addTexture(assetName);
            }
            yield this.delay(600);
            this.loadingComplete = true;
            this.initializeGameScenes();
            SceneManager.getInstance().changeSceneByName('DashboardScene');
        });
    }
    initializeGameScenes() {
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
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    render(renderer) {
        const canvas = renderer.getCanvas();
        // Màn hình trắng
        renderer.fillRect(0, 0, canvas.width, canvas.height, '#FFFFFF');
        // Chữ "Loading"
        renderer.drawText("Loading...", canvas.width / 2, canvas.height / 2, "24px Arial", "center", "#000000");
    }
    exit() {
        this.loadingComplete = false;
    }
}

;// ./src/Engine/GameScene/Scene/SceneInit.ts




class SceneBootstrapper {
    static bootstrapScenes() {
        console.log('SceneBootstrapper: Creating scenes...');
        const loadingScene = new LoadingScene();
        const dashboardScene = new DashboardScene();
        const playScene = new PlayScene();
        SceneManager.getInstance().AddScene('LoadingScene', loadingScene);
        SceneManager.getInstance().AddScene('DashboardScene', dashboardScene);
        SceneManager.getInstance().AddScene('PlayScene', playScene);
    }
}

;// ./src/Engine/Graphic/GraphicRender.ts
class Renderer {
    constructor() {
        this.initialized = false;
        this.canvas = document.createElement('canvas');
        const w = 500; // 448
        const h = 750; // 640
        this.canvas.width = w;
        this.canvas.height = h;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = Math.min(vw / w, vh / h);
        this.canvas.style.width = `${w * scale}px`;
        this.canvas.style.height = `${h * scale}px`;
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
        this.canvas.style.position = 'relative';
        this.canvas.style.background = '#fff';
        // document.body.style.background = '#000'; 
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('cudcnd');
        }
        this.ctx = ctx;
        document.body.appendChild(this.canvas);
        this.initialized = true;
    }
    render(image, x = 0, y = 0) {
        if (!this.initialized) {
            this.canvas.width = Math.max(image.width, 400);
            this.canvas.height = Math.max(image.height, 400);
            document.body.appendChild(this.canvas);
            this.initialized = true;
        }
        //    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(image, x, y);
    }
    fillRect(x, y, width, height, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
    }
    drawRect(x, y, width, height) {
        this.ctx.save();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    drawFrame(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    drawText(text, x, y, font = "20px Arial", textAlign = "center", color = "black") {
        if (!this.ctx)
            return;
        this.ctx.save();
        this.ctx.font = font;
        this.ctx.textAlign = textAlign;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }
    getCanvas() {
        return this.canvas;
    }
}

;// ./src/Application.ts




class Application {
    constructor() {
        this.lastTime = 0;
    }
    Init() {
        this.Renderer = new Renderer();
        InputHandle.initialize(this.Renderer.getCanvas());
        SceneBootstrapper.bootstrapScenes();
        SceneManager.getInstance().changeSceneByName('LoadingScene');
    }
    Run() {
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
    Update(deltaTime) {
        var _a;
        (_a = SceneManager.getInstance().getCurrentScene()) === null || _a === void 0 ? void 0 : _a.update(deltaTime);
    }
    Render() {
        var _a;
        (_a = SceneManager.getInstance().getCurrentScene()) === null || _a === void 0 ? void 0 : _a.render(this.Renderer);
    }
}

;// ./src/game.ts

class Game {
    constructor() {
    }
}
new Game();

const app = new Application();
app.Run();

/******/ })()
;