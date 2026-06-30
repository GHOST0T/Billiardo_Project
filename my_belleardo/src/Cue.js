// import * as THREE from "three";

// export class Cue {
//   constructor(scene, cueBall) {
//     this.scene = scene;
//     this.cueBall = cueBall;

//     this.length = 8.0;
//     this.radiusTop = 0.025;
//     this.radiusBottom = 0.08;

//     this.rotationAngle = 0;
//     this.distanceFromBall = 0.2;
//     this.power = 0;

//     this.mesh = new THREE.Group();
//     this.createMesh();

//     this.scene.add(this.mesh);
//   }

//   createMesh() {
//     const geometry = new THREE.CylinderGeometry(
//       this.radiusBottom,
//       this.radiusTop,
//       this.length,
//       32,
//     );
//     geometry.translate(0, this.length / 2, 0);

//     const shaftMaterial = new THREE.MeshStandardMaterial({
//       color: 0xeee8aa,
//       roughness: 0.2,
//       metalness: 0.05,
//     });

//     const buttMaterial = new THREE.MeshStandardMaterial({
//       color: 0x4a2e1b,
//       roughness: 0.3,
//       metalness: 0.1,
//     });

//     const indexCount = geometry.index.count;
//     geometry.addGroup(0, Math.floor(indexCount * 0.66), 0);
//     geometry.addGroup(Math.floor(indexCount * 0.66), indexCount, 1);

//     const materials = [shaftMaterial, buttMaterial];
//     const cueMesh = new THREE.Mesh(geometry, materials);
//     cueMesh.rotation.x = Math.PI / 2;
//     cueMesh.rotation.x += THREE.MathUtils.degToRad(-2.5);
//     this.mesh.add(cueMesh);
//   }

//   update(userInputAngle, isAiming = true) {
//     if (!isAiming) {
//       this.mesh.visible = false;
//       return;
//     }
//     this.mesh.visible = true;
//     this.rotationAngle = userInputAngle;
//     this.mesh.position.copy(this.cueBall.position);
//     this.mesh.position.y = this.cueBall.position.y;
//     this.mesh.rotation.y = this.rotationAngle;
//     const totalOffset = this.distanceFromBall + this.power;
//     this.mesh.children[0].position.set(0, 0, totalOffset);
//   }

//   setPower(currentPower) {
//     this.power = Math.min(currentPower, 1.5);
//   }
// }

import * as THREE from "three";

export class Cue {
  constructor(scene, cueBall) {
    this.scene = scene;
    this.cueBall = cueBall;

    this.strokeOffset = 0;       // مسافة التراجع الحالية (الشحن)
    this.maxOffset = 1.8;        // أقصى مسافة تراجع للخلف
    this.isShooting = false;     // هل العصا تندفع للأمام الآن؟
    this.shootSpeed = 0.5;       // سرعة حركة اندفاع العصا لضرب الكرة

    this.createMesh();
  }

  createMesh() {
    const length = 5;
    const geometry = new THREE.CylinderGeometry(0.04, 0.07, length, 16);
    
    // نقل نقطة الارتكاز ليكون رأس العصا هو المركز تماماً
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, -length / 2); 

    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.4 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  chargePower() {
    if (!this.isShooting && this.strokeOffset < this.maxOffset) {
      this.strokeOffset += 0.03; // سرعة سحب العصا للخلف أثناء الشحن
    }
  }

  release() {
    this.isShooting = true;
  }

  update(angle) {
    const baseDistance = 0.3; // مسافة الأمان الأساسية أمام الكرة

    if (this.isShooting) {
      this.strokeOffset -= this.shootSpeed;
      if (this.strokeOffset <= 0) {
        this.strokeOffset = 0;
        this.isShooting = false;
      }
    }

    const totalDistance = baseDistance + this.strokeOffset;

    const offsetX = Math.cos(angle) * -totalDistance;
    const offsetZ = Math.sin(angle) * -totalDistance;

    this.mesh.position.set(
      this.cueBall.position.x + offsetX,
      this.cueBall.position.y,
      this.cueBall.position.z + offsetZ
    );

    this.mesh.rotation.y = -angle + Math.PI / 2;
  }
}