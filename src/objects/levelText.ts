import Phaser from "phaser";
export default class levelText extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, sceneNum: number) {
        super(scene, 20, 20, "level " + sceneNum, {
            color: "white",
            fontSize: "28px",
        });
        scene.add.existing(this);
        this.setOrigin(0);
    }
}
