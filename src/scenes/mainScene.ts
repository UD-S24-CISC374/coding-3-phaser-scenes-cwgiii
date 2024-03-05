import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    private player?: Phaser.Physics.Arcade.Sprite;
    private bombs?: Phaser.Physics.Arcade.Group;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;
        const background = this.add.image(0, 0, "background").setOrigin(0);
        background.setScale(
            Math.max(
                cameraWidth / background.width,
                cameraHeight / background.height
            )
        );
        this.cursors = this.input.keyboard?.createCursorKeys();

        this.player = this.physics.add.sprite(
            cameraWidth / 2,
            cameraHeight / 2,
            "dude"
        );
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.bombs = this.physics.add.group({
            key: "bomb",
            repeat: 3,
            setXY: { x: 12, y: 10, stepX: 100 },
        });

        this.bombs.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.setCollideWorldBounds(true);
            child.setVelocity(
                Phaser.Math.Between(-200, 200),
                Phaser.Math.Between(0, 200)
            );
            child.body?.bounce.set(1);
            return true;
        });

        this.physics.add.collider(
            this.player,
            this.bombs,
            this.handleHitBomb,
            undefined,
            this
        );

        this.fpsText = new FpsText(this);

        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "#000000",
                fontSize: "24px",
            })
            .setOrigin(1, 0);
    }

    private handleHitBomb() {
        this.physics.pause();
        this.player?.setTint(0xff0000);
        this.player?.anims.play("turn");
    }

    update() {
        if (this.cursors) {
            if (this.cursors.left.isDown) {
                this.player?.setVelocityX(-160);
                this.player?.setVelocityY(0);
                this.player?.anims.play("left", true);
            } else if (this.cursors.right.isDown) {
                this.player?.setVelocityX(160);
                this.player?.setVelocityY(0);
                this.player?.anims.play("right", true);
            } else if (this.cursors.down.isDown) {
                this.player?.setVelocityY(160);
                this.player?.setVelocityX(0);
                this.player?.anims.play("turn");
            } else if (this.cursors.up.isDown) {
                this.player?.setVelocityY(-160);
                this.player?.setVelocityX(0);
                this.player?.anims.play("turn");
            } else {
                this.player?.setVelocityY(0);
                this.player?.setVelocityX(0);
                this.player?.anims.play("turn");
            }
        }
    }
}
