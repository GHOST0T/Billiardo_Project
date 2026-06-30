import * as THREE from "three";

export class Table {
  constructor(scene, width = 20, length = 10, height = 0.5) {
    this.scene = scene;
    this.width = width;
    this.length = length;
    this.height = height;

    this.borderThickness = 0.8;
    this.borderHeight = 0.4;

    this.mesh = new THREE.Group();
    this.woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c2c16,
      roughness: 0.4,
      metalness: 0.2,
    });

    this.clothMaterial = new THREE.MeshStandardMaterial({
      color: 0x006600,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.createWoodBase();
    this.createPlayingSurface();
    this.createBorders();
    this.createPockets();
    this.createPocketBoxes();
    this.createLegs();

    this.scene.add(this.mesh);
  }

  createWoodBase() {
    const totalWidth = this.width + this.borderThickness * 2;
    const totalLength = this.length + this.borderThickness * 2;
    const baseGeometry = new THREE.BoxGeometry(
      totalWidth,
      this.height,
      totalLength,
    );
    const woodBase = new THREE.Mesh(baseGeometry, this.woodMaterial);
    woodBase.position.y = -this.height / 2;
    this.mesh.add(woodBase);
  }

  createPlayingSurface() {
    const clothThickness = 0.02;
    const clothGeometry = new THREE.BoxGeometry(
      this.width,
      clothThickness,
      this.length,
    );
    const cloth = new THREE.Mesh(clothGeometry, this.clothMaterial);
    cloth.position.y = clothThickness / 2;
    this.mesh.add(cloth);
  }

  createBorders() {
    const longBorderGeo = new THREE.BoxGeometry(
      this.width + this.borderThickness * 2,
      this.borderHeight,
      this.borderThickness,
    );

    const backBorder = new THREE.Mesh(longBorderGeo, this.woodMaterial);
    backBorder.position.set(
      0,
      this.borderHeight / 2,
      -(this.length / 2 + this.borderThickness / 2),
    );

    const frontBorder = new THREE.Mesh(longBorderGeo, this.woodMaterial);
    frontBorder.position.set(
      0,
      this.borderHeight / 2,
      this.length / 2 + this.borderThickness / 2,
    );

    const shortBorderGeo = new THREE.BoxGeometry(
      this.borderThickness,
      this.borderHeight,
      this.length,
    );

    const leftBorder = new THREE.Mesh(shortBorderGeo, this.woodMaterial);
    leftBorder.position.set(
      -(this.width / 2 + this.borderThickness / 2),
      this.borderHeight / 2,
      0,
    );

    const rightBorder = new THREE.Mesh(shortBorderGeo, this.woodMaterial);
    rightBorder.position.set(
      this.width / 2 + this.borderThickness / 2,
      this.borderHeight / 2,
      0,
    );

    this.mesh.add(backBorder, frontBorder, leftBorder, rightBorder);
  }

  createPockets() {
    this.pockets = [];
    this.pocketRadius = 0.6;
    const pocketMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pocketGeometry = new THREE.CylinderGeometry(
      this.pocketRadius,
      this.pocketRadius,
      0.01,
      32,
    );

    const w2 = this.width / 2;
    const l2 = this.length / 2;
    this.pocketPositions = [
      { x: -w2, z: -l2 },
      { x: 0, z: -l2 },
      { x: w2, z: -l2 },
      { x: -w2, z: l2 },
      { x: 0, z: l2 },
      { x: w2, z: l2 },
    ];

    this.pocketPositions.forEach((pos) => {
      const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
      pocket.position.set(pos.x, 0.021, pos.z);
      this.mesh.add(pocket);

      this.pockets.push({ x: pos.x, z: pos.z, radius: this.pocketRadius });
    });
  }

  createPocketBoxes() {
    const boxWidth = this.pocketRadius * 2.4;
    const boxLength = this.pocketRadius * 2.4;
    const boxHeight = 1.9;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxLength);
    this.pocketPositions.forEach((pos) => {
      const pocketBox = new THREE.Mesh(boxGeometry, this.woodMaterial);
      const boxY = -boxHeight / 2;
      pocketBox.position.set(pos.x, boxY, pos.z);

      this.mesh.add(pocketBox);
    });
  }

  createLegs() {
    const legHeight = 7.0;
    const legRadiusTop = 0.4;
    const legRadiusBottom = 0.3;

    const legGeometry = new THREE.CylinderGeometry(
      legRadiusTop,
      legRadiusBottom,
      legHeight,
      16,
    );

    const offsetX = (this.width + this.borderThickness * 2) / 2 - 0.6;
    const offsetZ = (this.length + this.borderThickness * 2) / 2 - 0.6;
    const legY = -legHeight / 2 - this.height;

    const legPositions = [
      { x: -offsetX, z: -offsetZ },
      { x: offsetX, z: -offsetZ },
      { x: -offsetX, z: offsetZ },
      { x: offsetX, z: offsetZ },
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, this.woodMaterial);
      leg.position.set(pos.x, legY, pos.z);
      this.mesh.add(leg);
    });
  }
}
