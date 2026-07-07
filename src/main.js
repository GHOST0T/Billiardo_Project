import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Table } from "./Table.js";
import { Ball } from "./Ball.js";
import { Cue } from "./Cue.js";
import { Physics } from "./Physics.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.initCamera();
    this.initRenderer();
    this.initLights();

    this.table = new Table(this.scene);
    this.physics = new Physics(this.table.width, this.table.length);

    this.balls = [];
    this.createAllBalls();
    this.cue = new Cue(this.scene, this.cueBall);

    this.cueAngle = 0;
    this.spinOffset = 0;
    this.isCharging = false;

    this.initControls();

    window.addEventListener("resize", () => this.onWindowResize());

    this.gui = new GUI({ title: "Physics Controls" });

    this.gui.domElement.style.position = "absolute";
    this.gui.domElement.style.top = "70px";
    this.gui.domElement.style.right = "10px";

    this.physicsParams = {
      friction: 0.985,
      restitution: 0.94,
      cushionRestitution: 0.85,
      topBackSpin: 0.0,
      sideSpin: 0.0,
      cueBallMass: 1.0,
      objectBallsMass: 1.0,
    };

    this.gui
      .add(this.physicsParams, "topBackSpin", -2.0, 2.0, 0.1)
      .name("Top / Back Spin")
      .onChange((value) => {});

    this.gui
      .add(this.physicsParams, "sideSpin", -2.0, 2.0, 0.1)
      .name("Side Spin")
      .onChange((value) => {});

    this.gui
      .add(this.physicsParams, "friction", 0.9, 1.0, 0.001)
      .name("Friction (الاحتكاك)")
      .onChange((value) => {
        this.cueBall.friction = value;
        this.balls.forEach((ball) => (ball.friction = value));
      });

    this.gui
      .add(this.physicsParams, "restitution", 0.5, 1.0, 0.01)
      .name("Restitution (الارتداد)")
      .onChange((value) => {
        if (this.physics) {
          this.physics.restitution = value;
        }
      });

    this.gui
      .add(this.physicsParams, "cushionRestitution", 0.3, 1.0, 0.01)
      .name("Cushion (ارتداد الحواف)")
      .onChange((value) => {
        if (this.cueBall) this.cueBall.cushionRestitution = value;
        this.balls.forEach((ball) => (ball.cushionRestitution = value));
      });

    this.gui
      .add(this.physicsParams, "cueBallMass", 0.2, 5.0, 0.1)
      .name("وزن الكرة البيضاء")
      .onChange((value) => {
        this.cueBall.mass = value;
      });

    this.gui
      .add(this.physicsParams, "objectBallsMass", 0.2, 5.0, 0.1)
      .name("وزن الكرات الملونة")
      .onChange((value) => {
        this.balls.forEach((ball) => {
          if (!ball.isCueBall) ball.mass = value;
        });
      });

    this.animate = this.animate.bind(this);
    this.animate();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0, 15, 22);
  }

  initRenderer() {
    this.canvas = document.getElementById("billardCanvas") || undefined;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (!this.canvas) document.body.appendChild(this.renderer.domElement);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    const topLight = new THREE.DirectionalLight(0xffffff, 0.9);
    topLight.position.set(0, 20, 0);
    this.scene.add(topLight);
  }

  createAllBalls() {
    const ballRadius = 0.25;
    this.cueBall = new Ball(this.scene, -5, 0, ballRadius, 0, 0xffffff, false);

    this.balls.push(this.cueBall);

    const poolBallsConfig = [
      { num: 1, color: 0xffd700, striped: false },
      { num: 9, color: 0xffd700, striped: true },
      { num: 2, color: 0x0000ff, striped: false },
      { num: 10, color: 0x0000ff, striped: true },
      { num: 8, color: 0x000000, striped: false },
      { num: 3, color: 0xff0000, striped: false },
      { num: 11, color: 0xff0000, striped: true },
      { num: 4, color: 0x4b0082, striped: false },
      { num: 12, color: 0x4b0082, striped: true },
      { num: 5, color: 0x222222, striped: false },
      { num: 13, color: 0x8b0000, striped: true },
      { num: 6, color: 0x008000, striped: false },
      { num: 14, color: 0x008000, striped: true },
      { num: 15, color: 0x222222, striped: true },
      { num: 7, color: 0x8b0000, striped: false },
    ];

    const startX = 4.0;
    const startZ = 0.0;
    let index = 0;
    const rowSpacing = ballRadius * 2 * Math.cos(Math.PI / 6);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX + row * rowSpacing;
        const z = startZ + (col - row / 2) * (ballRadius * 2.02);
        const config = poolBallsConfig[index];
        const ball = new Ball(
          this.scene,
          x,
          z,
          ballRadius,
          config.num,
          config.color,
          config.striped,
        );
        this.balls.push(ball);
        index++;
      }
    }
  }
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A")
        this.cueAngle += 0.05;
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D")
        this.cueAngle -= 0.05;

      if (event.key === "w" || event.key === "W") {
        this.spinOffset += 0.1;
      }
      if (event.key === "s" || event.key === "S") {
        this.spinOffset -= 0.1;
      }

      if (event.key === " ") {
        event.preventDefault();
        if (this.cue && !this.cue.isShooting) {
          this.isCharging = true;
        }
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.key === " " && this.isCharging) {
        this.isCharging = false;

        if (this.cue) {
          let calculatedForce = Math.pow(this.cue.strokeOffset, 2) * 2.8;
          this.cue.release();

          if (calculatedForce > 0.02) {
            const finalVelocity = calculatedForce / this.cueBall.mass;

            this.cueBall.velocity.x = Math.cos(this.cueAngle) * finalVelocity;
            this.cueBall.velocity.z = Math.sin(this.cueAngle) * finalVelocity;

            this.cueBall.angularVelocity.x =
              -Math.sin(this.cueAngle) *
              this.physicsParams.topBackSpin *
              finalVelocity;
            this.cueBall.angularVelocity.z =
              Math.cos(this.cueAngle) *
              this.physicsParams.topBackSpin *
              finalVelocity;
            this.cueBall.angularVelocity.y =
              this.physicsParams.sideSpin * finalVelocity;
          }
        }
      }
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addBallToUI(ballNumber, ballColor, isStriped) {
    const bar = document.getElementById("fallen-balls-bar");
    if (!bar) return;

    const ballUI = document.createElement("div");
    const hexColor = "#" + ballColor.toString(16).padStart(6, "0");

    ballUI.style.width = "25px";
    ballUI.style.height = "25px";
    ballUI.style.borderRadius = "50%";
    ballUI.style.display = "flex";
    ballUI.style.alignItems = "center";
    ballUI.style.justifyContent = "center";
    ballUI.style.fontSize = "11px";
    ballUI.style.fontWeight = "bold";
    ballUI.style.color =
      ballNumber === 8 || ballColor === 0x000000 ? "white" : "black";
    ballUI.style.boxShadow =
      "inset -3px -3px 6px rgba(0,0,0,0.4), 2px 2px 4px rgba(0,0,0,0.3)";

    if (isStriped) {
      ballUI.style.background = `linear-gradient(to bottom, #ffffff 20%, ${hexColor} 20%, ${hexColor} 80%, #ffffff 80%)`;
    } else {
      ballUI.style.background = hexColor;
    }

    const numCircle = document.createElement("div");
    numCircle.style.width = "13px";
    numCircle.style.height = "13px";
    numCircle.style.background = "white";
    numCircle.style.borderRadius = "50%";
    numCircle.style.display = "flex";
    numCircle.style.alignItems = "center";
    numCircle.style.justifyContent = "center";
    numCircle.innerText = ballNumber;

    ballUI.appendChild(numCircle);
    bar.appendChild(ballUI);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();

    if (this.physics) {
      const subSteps = 3;
      for (let i = 0; i < subSteps; i++) {
        this.physics.updateCollisions(
          this.cueBall,
          this.balls,
          this.table.width,
          this.table.length,
        );
        this.balls.forEach((ball) =>
          ball.update(this.table.width, this.table.length, subSteps),
        );
      }

      const fallenBalls = this.physics.checkPockets(
        this.cueBall,
        this.balls,
        this.table.pockets,
      );

      if (fallenBalls.length > 0) {
        fallenBalls.forEach((ball) => {
          this.addBallToUI(ball.number, ball.baseColor, ball.isStriped);
          this.scene.remove(ball.mesh);
          this.balls = this.balls.filter((b) => b !== ball);
        });
      }
    }

    if (this.cue) {
      const isMoving = this.balls.some(
        (b) => b.velocity.length() > 0.0001 || b.position.y > b.radius + 0.022,
      );
      if (isMoving) {
        this.cue.mesh.visible = false;
      } else {
        if (this.physics && this.physics.cueBallFallen) {
          this.cueBall.velocity.set(0, 0, 0);
          this.cueBall.angularVelocity.set(0, 0, 0);
          this.cueBall.position.set(-5, this.cueBall.radius + 0.02, 0);
          this.cueBall.mesh.visible = true;
          this.physics.cueBallFallen = false;
        }

        this.cue.mesh.visible = true;
        if (this.isCharging) this.cue.chargePower();
        this.cue.update(this.cueAngle);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new Game();
});
