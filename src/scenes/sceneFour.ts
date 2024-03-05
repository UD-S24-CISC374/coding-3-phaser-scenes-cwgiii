import Phaser from "phaser";
import FpsText from "../objects/fpsText";

export default class sceneFour extends Phaser.Scene {
    fpsText: FpsText;
    private player?: Phaser.Physics.Arcade.Sprite;
    private bombs?: Phaser.Physics.Arcade.Group;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private stars?: Phaser.Physics.Arcade.Group;
    private gameOver?: Phaser.GameObjects.Text;
    private level?: Phaser.GameObjects.Text;
    private youWin?: Phaser.GameObjects.Text;
    private playAgain: Phaser.GameObjects.Text;

    constructor() {
        super({ key: "sceneFour" });
    }

    create() {
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;
        const backgroundFour = this.add
            .image(0, 0, "backgroundFour")
            .setOrigin(0);
        backgroundFour.setScale(
            Math.max(
                cameraWidth / backgroundFour.width,
                cameraHeight / backgroundFour.height
            )
        );

        this.level = this.add.text(20, 20, "Level: 4", {
            color: "White",
            fontSize: "28px",
        });

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

        this.stars = this.physics.add.group({
            key: "star",
            repeat: 12,
            setXY: {
                x: Phaser.Math.Between(0, cameraWidth - 50),
                y: Phaser.Math.Between(0, cameraHeight - 50),
            },
        });

        this.stars.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.setCollideWorldBounds(true);
            child.setVelocity(
                Phaser.Math.Between(-200, 200),
                Phaser.Math.Between(0, 200)
            );
            child.body?.bounce.set(1);
            return true;
        });

        this.bombs = this.physics.add.group({
            key: "bomb",
            repeat: 12,
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

        this.physics.add.overlap(
            this.player,
            this.stars,
            this.handleCollectStar,
            undefined,
            this
        );

        this.fpsText = new FpsText(this);

        const message = `Phaser v${Phaser.VERSION}`;
        this.add
            .text(this.cameras.main.width - 15, 15, message, {
                color: "White",
                fontSize: "24px",
            })
            .setOrigin(1, 0);
    }

    private handleHitBomb() {
        this.physics.pause();
        this.player?.setTint(0xff0000);
        this.player?.anims.play("turn");
        this.gameOver = this.add.text(
            this.cameras.main.width / 2 - 75,
            this.cameras.main.height / 2,
            "Game Over",
            { color: "White", fontSize: "28px" }
        );
        this.playAgain = this.add.text(
            this.cameras.main.width / 2 - 195,
            this.cameras.main.height / 2 + 50,
            "Press space to try again",
            { color: "White", fontSize: "28px" }
        );
    }

    private handleCollectStar(
        p:
            | Phaser.Types.Physics.Arcade.GameObjectWithBody
            | Phaser.Tilemaps.Tile,
        s: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
    ) {
        const star = s as Phaser.Physics.Arcade.Image;
        star.disableBody(true, true);
        if (this.stars?.countActive(true) === 0) {
            this.scene.pause("sceneFour");
            this.youWin = this.add.text(
                this.cameras.main.width / 2 - 75,
                this.cameras.main.height / 2,
                "You Win!",
                { color: "White", fontSize: "28px" }
            );
            this.playAgain = this.add.text(
                this.cameras.main.width / 2 - 195,
                this.cameras.main.height / 2 + 50,
                "Press space to play again",
                { color: "White", fontSize: "28px" }
            );
        }
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
            } else if (this.cursors.space.isDown) {
                this.scene.start("MainScene");
            } else {
                this.player?.setVelocityY(0);
                this.player?.setVelocityX(0);
                this.player?.anims.play("turn");
            }
        }
    }
}
