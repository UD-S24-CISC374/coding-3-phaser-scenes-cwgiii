import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {
        this.load.image("background", "assets/cavefloor.png");
        this.load.spritesheet("dude", "assets/dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("bomb", "assets/bomb.png");
        this.load.image("star", "assets/star.png");
        this.load.image("backgroundTwo", "assets/city.jpeg");
        this.load.image("backgroundThree", "assets/jungle.webp");
        this.load.image("backgroundFour", "assets/space.webp");
    }

    create() {
        this.scene.start("MainScene");
    }
}
