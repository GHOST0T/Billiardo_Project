import * as THREE from "three";

export class Cue {
  constructor(scene, cueBall, tableLength = 10) {
    this.scene = scene;
    this.cueBall = cueBall;
    this.length = tableLength * 1;
    this.offCenterLimit = 0.3;
    
    this.strokeOffset = 0;       
    this.maxOffset = 1.8;        
    this.isShooting = false;     
    this.shootSpeed = 0.45;       

    this.aim = {
      angle: 0,
      power: 0,
      pos: new THREE.Vector3(),
      offset: new THREE.Vector3(0, 0, 0)
    };

    this.placermaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      wireframe: false,
      flatShading: false,
      transparent: false,
    });

    const R = this.cueBall.radius;
    this.createMesh(R);
    this.helperMesh = this.createHelper(R);
    this.placerMesh = this.createPlacer(R);

    this.scene.add(this.helperMesh);
    this.scene.add(this.placerMesh);

    this.aimMode();
  }

  indicateValid(valid) {
    this.placermaterial.color.setHex(valid ? 0xccffcc : 0xff0000);
  }

  createHelperMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        lightDirection: { value: new THREE.Vector3(0, 0, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;  
        void main() {
          vNormal = normal;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform vec3 lightDirection;
        void main() {
          float intensity = dot(vNormal, lightDirection);
          vec3 color = vec3(1.0, 1.0, 1.0);
          vec3 finalColor = color * intensity;
          gl_FragColor = vec4(finalColor, 0.05 * (1.0-vUv.y));
        }
      `,
      wireframe: false,
      transparent: true,
    });
  }

  createHelper(R) {
    const geometry = new THREE.CylinderGeometry(R * 0.03, R * 0.03, (R * 30) / 0.5, 12, 1, true);
    const material = this.createHelperMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.geometry.applyMatrix4(new THREE.Matrix4().identity().makeTranslation(0, (R * 15) / 0.5, 0));
    mesh.visible = false;
    mesh.renderOrder = -1;
    mesh.material.depthTest = false;
    return mesh;
  }

  createPlacer(R) {
    const group = new THREE.Group();
    const pyramidGeo = new THREE.ConeGeometry(0.75 * R, 1.6 * R, 4);
    const n = 4;
    for (let i = 0; i < n; i++) {
      const pyramid = new THREE.Mesh(pyramidGeo, this.placermaterial);
      const angle = (i * 2 * Math.PI) / n;
      pyramid.position.x = Math.cos(angle) * 2 * R;
      pyramid.position.z = Math.sin(angle) * 2 * R;
      pyramid.position.y = 0.022;
      pyramid.lookAt(0, 0, 0);
      pyramid.rotateX(Math.PI / 2);
      group.add(pyramid);
    }
    group.visible = false;
    return group;
  }

  createMesh(R) {
    const group = this.cueGeometry((R * 0.07) / 0.5, (R * 0.23) / 0.5, this.length);
    this.mesh = new THREE.Group();
    
    const tiltGroup = new THREE.Group();
    tiltGroup.add(group);
    
    const tilt = -0.06;
    tiltGroup.rotation.x = tilt;
    
    this.mesh.add(tiltGroup);
    this.scene.add(this.mesh);
  }

cueGeometry(tipRadius, buttRadius, length, segments = 9) {
    const group = new THREE.Group();
    const ashWoodMat = new THREE.MeshPhongMaterial({ color: 0xd2b48c, shininess: 50 });
    const ebonyMat = new THREE.MeshPhongMaterial({ color: 0x1a1a1a, roughness: 0.5 });
    const ferruleMat = new THREE.MeshPhongMaterial({ color: 0xe5e5e5, shininess: 100 });
    const tipMat = new THREE.MeshPhongMaterial({ color: 0x4a7c9a, shininess: 5 });

    const buttLength = length * 0.28;
    const shaftLength = length * 0.71;
    const ferruleLength = length * 0.007;

    const butt = new THREE.Mesh(new THREE.CylinderGeometry(buttRadius * 0.9, buttRadius, buttLength, segments), ebonyMat);
    butt.rotation.x = Math.PI / 2;
    butt.position.z = length - buttLength / 2;
    group.add(butt);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(buttRadius * 0.9, tipRadius, shaftLength, segments), ashWoodMat);
    shaft.rotation.x = Math.PI / 2;
    shaft.position.z = butt.position.z - buttLength / 2 - shaftLength / 2;
    group.add(shaft);

    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(tipRadius, tipRadius, ferruleLength, segments), ferruleMat);
    ferrule.rotation.x = Math.PI / 2;
    ferrule.position.z = shaft.position.z - shaftLength / 2 - ferruleLength / 2;
    group.add(ferrule);

    const tipHeight = 0.04;
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(tipRadius * 0.93, tipRadius, tipHeight, segments), tipMat);
    tip.rotation.x = Math.PI / 2;
    tip.position.z = ferrule.position.z - ferruleLength / 2 - tipHeight / 2;
    tip.name = "cueTip";
    group.add(tip);

    return group;
  }

  chargePower() {
    if (!this.isShooting && this.strokeOffset < this.maxOffset) {
      this.strokeOffset += 0.025; 
    }
  }

  release() {
    this.isShooting = true;
  }

  placeBallMode() {
    this.mesh.visible = false;
    this.placerMesh.visible = true;
    this.helperMesh.visible = false;
    this.aim.angle = 0;
  }

  aimMode() {
    this.mesh.visible = true;
    this.placerMesh.visible = false;
    this.helperMesh.visible = true;
  }

  showHelper(b) {
    this.helperMesh.visible = b;
  }

  toggleHelper() {
    this.showHelper(!this.helperMesh.visible);
  }

  resetProgress() {
    this.strokeOffset = 0;
    this.isShooting = false;
  }

  spinOffset() {
    const R = this.cueBall.radius;
    const rightX = -Math.sin(this.aim.angle);
    const rightZ = Math.cos(this.aim.angle);
    return new THREE.Vector3(
      rightX * this.aim.offset.x * 2 * R,
      this.aim.offset.y * 2 * R,
      rightZ * this.aim.offset.x * 2 * R
    );
  }

  moveTo(pos) {
    this.aim.pos.copy(pos);
    const R = this.cueBall.radius;
    const offset = this.spinOffset();

    const forwardX = Math.cos(this.aim.angle);
    const forwardZ = Math.sin(this.aim.angle);

    const tilt = 0.08; 
    const baseDistance = R + 0.02;
    const dynamicOffset = this.strokeOffset;
    const totalDistance = baseDistance + dynamicOffset;

    this.mesh.position.set(
      pos.x - forwardX * (totalDistance * Math.cos(tilt)) + offset.x,
      pos.y + R * 0.4 + offset.y,
      pos.z - forwardZ * (totalDistance * Math.cos(tilt)) + offset.z
    );

    this.mesh.rotation.y = -this.aim.angle - Math.PI / 2;

    this.helperMesh.position.copy(pos);
    this.helperMesh.position.y = pos.y;
    this.helperMesh.rotation.y = -this.aim.angle + Math.PI / 2;

    this.placerMesh.position.copy(pos);
    this.placerMesh.position.y = pos.y;
  }

  update(angle) {
    this.aim.angle = angle;
    
    if (this.isShooting) {
      this.strokeOffset -= this.shootSpeed;
      if (this.strokeOffset <= 0) {
        this.strokeOffset = 0;
        this.isShooting = false;
      }
    }

    this.moveTo(this.cueBall.position);
  }
}