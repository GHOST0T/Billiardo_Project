import * as THREE from "three";

export class Cue {
  constructor(scene, cueBall) {
    this.scene = scene;
    this.cueBall = cueBall;

    this.strokeOffset = 0;       
    this.maxOffset = 1.8;        
    this.isShooting = false;     
    this.shootSpeed = 0.45;       
    this.t = 0;

    this.createMesh();
  }

  createMesh() {
    this.mesh = new THREE.Group();

    const buttLength = 1.5;
    const buttGeo = new THREE.CylinderGeometry(0.035, 0.05, buttLength, 16);
    const buttMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7, metalness: 0.1 });
    const buttMesh = new THREE.Mesh(buttGeo, buttMat);
    buttMesh.rotation.x = Math.PI / 2;
    buttMesh.position.z = 4.25;

    const collarLength = 0.08;
    const collarGeo = new THREE.CylinderGeometry(0.031, 0.035, collarLength, 16);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.1, metalness: 0.9 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.z = 3.46;

    const shaftLength = 3.3;
    const shaftGeo = new THREE.CylinderGeometry(0.015, 0.031, shaftLength, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xebdcb9, roughness: 0.5 });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.rotation.x = Math.PI / 2;
    shaftMesh.position.z = 1.77;

    const ferruleLength = 0.06;
    const ferruleGeo = new THREE.CylinderGeometry(0.0145, 0.015, ferruleLength, 16);
    const ferruleMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3 });
    const ferruleMesh = new THREE.Mesh(ferruleGeo, ferruleMat);
    ferruleMesh.rotation.x = Math.PI / 2;
    ferruleMesh.position.z = 0.09;

    const tipLength = 0.04;
    const tipGeo = new THREE.CylinderGeometry(0.014, 0.0143, tipLength, 16);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0x4682b4, roughness: 0.9 });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.rotation.x = Math.PI / 2;
    tipMesh.position.z = 0.04;

    this.mesh.add(buttMesh);
    this.mesh.add(collarMesh);
    this.mesh.add(shaftMesh);
    this.mesh.add(ferruleMesh);
    this.mesh.add(tipMesh);
    this.scene.add(this.mesh);
  }

  chargePower() {
    if (!this.isShooting && this.strokeOffset < this.maxOffset) {
      this.strokeOffset += 0.025; 
    }
  }

  release() {
    this.isShooting = true;
    this.t = 0;
  }

  update(angle) {
    const baseDistance = 0.3; 

    if (this.isShooting) {
      this.t += 0.12;
      this.strokeOffset -= this.shootSpeed;
      if (this.strokeOffset <= 0) {
        this.strokeOffset = 0;
        this.isShooting = false;
      }
    }

    let swing = 0;
    if (this.isShooting || this.t > 0) {
      swing = Math.sin(this.t * 2.5) * 0.18 * Math.exp(-this.t * 0.4);
      if (!this.isShooting && Math.abs(swing) < 0.001) {
        this.t = 0;
      }
    }

    const totalDistance = baseDistance + this.strokeOffset + swing;

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