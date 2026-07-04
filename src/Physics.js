import * as THREE from "three";
import breakHitUrl from "./assets/break_hit.wav";
import ballHitUrl from "./assets/ball_hit.wav";
import pocketDropUrl from "./assets/pocket_drop.wav";

export class Physics {
  constructor(tableWidth, tableLength) {
    this.tableWidth = tableWidth;
    this.tableLength = tableLength;
    this.restitution = 0.94;
    this.cueBallFallen = false;

    this.breakSound = new Audio(breakHitUrl);
    this.regularSound = new Audio(ballHitUrl);
    this.pocketSound = new Audio(pocketDropUrl);

    this.breakSound.load();
    this.regularSound.load();
    this.pocketSound.load();
  }

  updateCollisions(cueBall, balls) {
    const allBalls = [cueBall, ...balls];
    for (let i = 0; i < allBalls.length; i++) {
      for (let j = i + 1; j < allBalls.length; j++) {
        this.checkAndResolveCollision(allBalls[i], allBalls[j]);
      }
    }
  }

  checkAndResolveCollision(ballA, ballB) {
    const minDistance = ballA.radius + ballB.radius;
    const dx = ballB.position.x - ballA.position.x;
    const dz = ballB.position.z - ballA.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < minDistance && distance > 0) {
      const mA = ballA.mass || 1.0;
      const mB = ballB.mass || 1.0;
      const massSum = mA + mB;

      const overlap = minDistance - distance;
      const nx = dx / distance;
      const nz = dz / distance;

      ballA.position.x -= nx * overlap * (mB / massSum);
      ballA.position.z -= nz * overlap * (mB / massSum);
      ballB.position.x += nx * overlap * (mA / massSum);
      ballB.position.z += nz * overlap * (mA / massSum);

      const rvx = ballB.velocity.x - ballA.velocity.x;
      const rvz = ballB.velocity.z - ballA.velocity.z;
      const velAlongNormal = rvx * nx + rvz * nz;

      if (velAlongNormal < 0) {
        const e = this.restitution;
        const impulseScalar = -(1 + e) * velAlongNormal / massSum;

        ballA.velocity.x -= nx * impulseScalar * mB;
        ballA.velocity.z -= nz * impulseScalar * mB;
        ballB.velocity.x += nx * impulseScalar * mA;
        ballB.velocity.z += nz * impulseScalar * mA;

        const impactSpeed = Math.abs(velAlongNormal);
        const isCueBallInvolved = ballA.isCueBall || ballB.isCueBall;
        const fallenBar = document.getElementById("fallen-balls-bar");
        const isFirstShot = fallenBar ? fallenBar.children.length === 0 : true;

        if (isCueBallInvolved && isFirstShot && impactSpeed > 0.4) {
          this.breakSound.currentTime = 0;
          this.breakSound.volume = 1.0;
          this.breakSound.play();
        } else {
          this.regularSound.currentTime = 0;
          this.regularSound.volume = Math.min(1.0, Math.max(0.1, impactSpeed * 2.5));
          this.regularSound.play();
        }
      }
    }
  }

  checkPockets(cueBall, balls, tablePockets) {
    const fallenBalls = [];
    const allBalls = [cueBall, ...balls];

    allBalls.forEach((ball) => {
      tablePockets.forEach((pocket) => {
        const dx = ball.position.x - pocket.x;
        const dz = ball.position.z - pocket.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < pocket.radius) {
          if (ball.isCueBall && !this.cueBallFallen) {
            this.pocketSound.currentTime = 0;
            this.pocketSound.volume = 0.8;
            this.pocketSound.play();

            this.cueBallFallen = true;
            ball.velocity.set(0, 0, 0);
            ball.angularVelocity.set(0, 0, 0);
            ball.mesh.visible = false;
          } else if (!ball.isCueBall) {
            this.pocketSound.currentTime = 0;
            this.pocketSound.volume = 0.8;
            this.pocketSound.play();

            if (!fallenBalls.includes(ball)) {
              fallenBalls.push(ball);
            }
          }
        }
      });
    });

    return fallenBalls;
  }
}