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
    this.createRoomEnvironment();

    this.scene.add(this.mesh);
  }

  createWoodBase() {
    const totalWidth = this.width + this.borderThickness * 2;
    const totalLength = this.length + this.borderThickness * 2;
    const baseGeometry = new THREE.BoxGeometry(
      totalWidth,
      this.height,
      totalLength
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
      this.length
    );
    const cloth = new THREE.Mesh(clothGeometry, this.clothMaterial);
    cloth.position.y = clothThickness / 2;
    this.mesh.add(cloth);
  }

  createBorders() {
    const longBorderGeo = new THREE.BoxGeometry(
      this.width + this.borderThickness * 2,
      this.borderHeight,
      this.borderThickness
    );

    const backBorder = new THREE.Mesh(longBorderGeo, this.woodMaterial);
    backBorder.position.set(
      0,
      this.borderHeight / 2,
      -(this.length / 2 + this.borderThickness / 2)
    );

    const frontBorder = new THREE.Mesh(longBorderGeo, this.woodMaterial);
    frontBorder.position.set(
      0,
      this.borderHeight / 2,
      this.length / 2 + this.borderThickness / 2
    );

    const shortBorderGeo = new THREE.BoxGeometry(
      this.borderThickness,
      this.borderHeight,
      this.length
    );

    const leftBorder = new THREE.Mesh(shortBorderGeo, this.woodMaterial);
    leftBorder.position.set(
      -(this.width / 2 + this.borderThickness / 2),
      this.borderHeight / 2,
      0
    );

    const rightBorder = new THREE.Mesh(shortBorderGeo, this.woodMaterial);
    rightBorder.position.set(
      this.width / 2 + this.borderThickness / 2,
      this.borderHeight / 2,
      0
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
      32
    );

    const w2 = this.width / 2;
    const l2 = this.length / 2;
    this.pocketPositions = [
      { x: -w2, z: -l2 },
      { x: 0, z: -l2 },
      { x: w2, z: -l2 },
      { x: -w2, z: l2 },
      { x: 0, z: l2 },
      { x: w2, z: l2 }
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
      16
    );

    const offsetX = (this.width + this.borderThickness * 2) / 2 - 0.6;
    const offsetZ = (this.length + this.borderThickness * 2) / 2 - 0.6;
    const legY = -legHeight / 2 - this.height;

    const legPositions = [
      { x: -offsetX, z: -offsetZ },
      { x: offsetX, z: -offsetZ },
      { x: -offsetX, z: offsetZ },
      { x: offsetX, z: offsetZ }
    ];

    legPositions.forEach((pos) => {
      const leg = new THREE.Mesh(legGeometry, this.woodMaterial);
      leg.position.set(pos.x, legY, pos.z);
      this.mesh.add(leg);
    });
  }
  createRoomEnvironment() {
    const plankWidth = 2.0;
    const plankLength = 60.0;
    const plankGeo = new THREE.PlaneGeometry(plankWidth, plankLength);
    for (let xPos = -30; xPos <= 30; xPos += plankWidth) {
      const tone = Math.abs(xPos) % 4 === 0 ? 0x2d1a15 : 0x36221c;
      const parquetMat = new THREE.MeshStandardMaterial({
        color: tone,
        roughness: 0.3,
        metalness: 0.1,
      });
      const plank = new THREE.Mesh(plankGeo, parquetMat);
      plank.rotation.x = -Math.PI / 2;
      plank.position.set(xPos, -7.5, 0);
      plank.matrixAutoUpdate = false;
      plank.updateMatrix();
      this.mesh.add(plank);
    }

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1c1d1f, roughness: 0.7 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x121314, roughness: 0.4 });

    const backWallGeo = new THREE.PlaneGeometry(80, 30);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 7.5, -30);
    backWall.matrixAutoUpdate = false;
    backWall.updateMatrix();

    const frontWall = new THREE.Mesh(backWallGeo, wallMat);
    frontWall.position.set(0, 7.5, 30);
    frontWall.rotation.y = Math.PI;
    frontWall.matrixAutoUpdate = false;
    frontWall.updateMatrix();
    this.mesh.add(backWall, frontWall);

    const sideWallGeo = new THREE.PlaneGeometry(60, 30);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-30, 7.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.matrixAutoUpdate = false;
    leftWall.updateMatrix();

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(30, 7.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.matrixAutoUpdate = false;
    rightWall.updateMatrix();
    this.mesh.add(leftWall, rightWall);

    const pillarGeo = new THREE.BoxGeometry(1.5, 30, 0.4);

    for (let i = -3; i <= 3; i++) {
      const pX = i * 9;
      const pBack = new THREE.Mesh(pillarGeo, pillarMat);
      pBack.position.set(pX, 7.5, -29.8);
      pBack.matrixAutoUpdate = false;
      pBack.updateMatrix();
      const pFront = new THREE.Mesh(pillarGeo, pillarMat);
      pFront.position.set(pX, 7.5, 29.8);
      pFront.matrixAutoUpdate = false;
      pFront.updateMatrix();
      this.mesh.add(pBack, pFront);
    }

    for (let j = -2; j <= 2; j++) {
      const pZ = j * 12;
      const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
      pLeft.position.set(-29.8, 7.5, pZ);
      pLeft.rotation.y = Math.PI / 2;
      pLeft.matrixAutoUpdate = false;
      pLeft.updateMatrix();
      const pRight = new THREE.Mesh(pillarGeo, pillarMat);
      pRight.position.set(29.8, 7.5, pZ);
      pRight.rotation.y = Math.PI / 2;
      pRight.matrixAutoUpdate = false;
      pRight.updateMatrix();
      this.mesh.add(pLeft, pRight);
    }

    const lightColor = 0xffaa44;
    const roomLightBack = new THREE.PointLight(lightColor, 15, 45, 1.2);
    roomLightBack.position.set(0, 10, -20);
    const roomLightFront = new THREE.PointLight(lightColor, 15, 45, 1.2);
    roomLightFront.position.set(0, 10, 20);
    const roomLightLeft = new THREE.PointLight(lightColor, 15, 45, 1.2);
    roomLightLeft.position.set(-20, 10, 0);
    const roomLightRight = new THREE.PointLight(lightColor, 15, 45, 1.2);
    roomLightRight.position.set(20, 10, 0);
    this.scene.add(roomLightBack, roomLightFront, roomLightLeft, roomLightRight);

    const ceilingGeo = new THREE.PlaneGeometry(60, 60);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x151617, roughness: 0.6 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 22.5;
    ceiling.matrixAutoUpdate = false;
    ceiling.updateMatrix();
    this.mesh.add(ceiling);

    const beamMat = new THREE.MeshStandardMaterial({ color: 0x0f0a08, roughness: 0.5 });
    const longBeamGeo = new THREE.BoxGeometry(60, 0.6, 0.4);
    for (let bZ = -24; bZ <= 24; bZ += 8) {
      const beam = new THREE.Mesh(longBeamGeo, beamMat);
      beam.position.set(0, 22.2, bZ);
      beam.matrixAutoUpdate = false;
      beam.updateMatrix();
      this.mesh.add(beam);
    }
    const shortBeamGeo = new THREE.BoxGeometry(0.4, 0.6, 60);
    for (let bX = -24; bX <= 24; bX += 8) {
      const beam = new THREE.Mesh(shortBeamGeo, beamMat);
      beam.position.set(bX, 22.2, 0);
      beam.matrixAutoUpdate = false;
      beam.updateMatrix();
      this.mesh.add(beam);
    }

    const lampGeo = new THREE.BoxGeometry(3.5, 0.15, 0.8);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const glassGeo = new THREE.BoxGeometry(3.4, 0.02, 0.7);

    const lampPositions = [-6, 0, 6];
    lampPositions.forEach((zPos) => {
      const lampGroup = new THREE.Group();
      const frame = new THREE.Mesh(lampGeo, lampMat);
      const glass = new THREE.Mesh(glassGeo, lightMat);
      glass.position.y = -0.08;
      lampGroup.add(frame, glass);

      const hangerGeo = new THREE.CylinderGeometry(0.02, 0.02, 12.5, 8);
      const hangerMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const hanger1 = new THREE.Mesh(hangerGeo, hangerMat);
      const hanger2 = new THREE.Mesh(hangerGeo, hangerMat);
      hanger1.position.set(-1.2, 6.25, 0);
      hanger2.position.set(1.2, 6.25, 0);
      lampGroup.add(hanger1, hanger2);

      lampGroup.position.set(0, 10, zPos);
      this.mesh.add(lampGroup);

      const tableSpot = new THREE.SpotLight(0xffffff, 14, 20, Math.PI / 4, 0.5, 1.0);
      tableSpot.position.set(0, 9.8, zPos);
      tableSpot.target.position.set(0, 0, zPos);
      this.scene.add(tableSpot);
      this.scene.add(tableSpot.target);
    });
  }
}