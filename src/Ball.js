import * as THREE from "three";
import cushionHitUrl from "./assets/cushion_hit.wav";

export class Ball {
  constructor(scene, x, z, radius = 0.25, number = 0, baseColor = 0xffffff, isStriped = false) {
    this.scene = scene;
    this.radius = radius;
    this.number = number;
    this.baseColor = baseColor;
    this.isStriped = isStriped;
    this.isCueBall = number === 0;

    this.position = new THREE.Vector3(x, this.radius + 0.02, z);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0); 
    this.friction = 0.988; 
    this.mass = 1.0; 

    this.cushionSound = new Audio(cushionHitUrl);
    this.cushionSound.load();

    this.createMesh();
  }

  generateBallTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256; 
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const hexColor = "#" + this.baseColor.toString(16).padStart(6, "0");
    if (this.isCueBall) { 
      ctx.fillStyle = "#ffffff"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height); 
    } 
    else {
      ctx.fillStyle = hexColor; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (this.isStriped) { 
        ctx.fillStyle = "#ffffff"; 
        ctx.fillRect(0, 54, canvas.width, 20); 
      }
      this.drawNumberCircle(ctx, 64, 64); 
      this.drawNumberCircle(ctx, 192, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }

  drawNumberCircle(ctx, x, y) {
    ctx.beginPath(); 
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff"; 
    ctx.fill(); 
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px Arial"; 
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle";
    ctx.fillText(this.number.toString(), x, y);
  }

  createMesh() {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    const texture = this.generateBallTexture();
    const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.12, metalness: 0.08 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  update(tableWidth, tableLength, subSteps = 1) {
    const maxSpeed = 1.5; 
    if (this.velocity.length() > maxSpeed) {
      this.velocity.setLength(maxSpeed);
    }
    
    this.position.x += this.velocity.x / subSteps;
    this.position.z += this.velocity.z / subSteps;

    const slipX = this.velocity.x - (-this.angularVelocity.z * this.radius);
    const slipZ = this.velocity.z - (this.angularVelocity.x * this.radius);

    const correctionX = (slipX * 0.05) / subSteps;
    const correctionZ = (slipZ * 0.04) / subSteps;

    this.velocity.x -= correctionX;
    this.velocity.z -= correctionZ;

    this.angularVelocity.z -= (correctionX / this.radius) * 1.5; 
    this.angularVelocity.x += (correctionZ / this.radius) * 1.5;

    const effectiveFriction = Math.pow(this.friction, 1 / subSteps);
    this.velocity.x *= effectiveFriction;
    this.velocity.z *= effectiveFriction;
    this.angularVelocity.multiplyScalar(effectiveFriction);

    if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;
    if (Math.abs(this.velocity.z) < 0.001) this.velocity.z = 0;

    const deltaRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(this.angularVelocity.x / subSteps, this.angularVelocity.y / subSteps, this.angularVelocity.z / subSteps, 'XYZ')
    );
    this.mesh.quaternion.multiplyQuaternions(deltaRotation, this.mesh.quaternion);

    const boundaryX = tableWidth / 2 - this.radius;
    const boundaryZ = tableLength / 2 - this.radius;

    if (this.position.x > boundaryX) { 
      this.position.x = boundaryX; 
      const strikeImpact = Math.abs(this.velocity.x);
      this.cushionSound.currentTime = 0;
      this.cushionSound.volume = Math.min(1.0, Math.max(0.1, strikeImpact * 2.5));
      this.cushionSound.play();
      this.velocity.x = -this.velocity.x * 0.85; 
      this.angularVelocity.z = -this.angularVelocity.z * 0.85; 
      this.velocity.z += this.angularVelocity.y * this.radius * 0.5;
    } 
    else if (this.position.x < -boundaryX) { 
      this.position.x = -boundaryX; 
      const strikeImpact = Math.abs(this.velocity.x);
      this.cushionSound.currentTime = 0;
      this.cushionSound.volume = Math.min(1.0, Math.max(0.1, strikeImpact * 2.5));
      this.cushionSound.play();
      this.velocity.x = -this.velocity.x * 0.85; 
      this.angularVelocity.z = -this.angularVelocity.z * 0.85; 
      this.velocity.z -= this.angularVelocity.y * this.radius * 0.5;
    }

    if (this.position.z > boundaryZ) { 
      this.position.z = boundaryZ; 
      const strikeImpact = Math.abs(this.velocity.z);
      this.cushionSound.currentTime = 0;
      this.cushionSound.volume = Math.min(1.0, Math.max(0.1, strikeImpact * 2.5));
      this.cushionSound.play();
      this.velocity.z = -this.velocity.z * 0.85; 
      this.angularVelocity.x = -this.angularVelocity.x * 0.85; 
      this.velocity.x -= this.angularVelocity.y * this.radius * 0.5;
    } 
    else if (this.position.z < -boundaryZ) { 
      this.position.z = -boundaryZ; 
      const strikeImpact = Math.abs(this.velocity.z);
      this.cushionSound.currentTime = 0;
      this.cushionSound.volume = Math.min(1.0, Math.max(0.1, strikeImpact * 2.5));
      this.cushionSound.play();
      this.velocity.z = -this.velocity.z * 0.85; 
      this.angularVelocity.x = -this.angularVelocity.x * 0.85; 
      this.velocity.x += this.angularVelocity.y * this.radius * 0.5;
    }
    this.mesh.position.copy(this.position);
  }
}
