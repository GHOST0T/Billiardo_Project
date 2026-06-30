// import * as THREE from "three";

// export class Ball {
//   constructor(scene, x, z, radius = 0.25, number = 0, baseColor = 0xffffff, isStriped = false) {
//     this.scene = scene;
//     this.radius = radius;
//     this.number = number;
//     this.baseColor = baseColor;
//     this.isStriped = isStriped;
//     this.isCueBall = number === 0;

//     this.position = new THREE.Vector3(x, this.radius + 0.02, z);
//     this.velocity = new THREE.Vector3(0, 0, 0);
    
//     // 🔄 إضافة متجهات السرعة الزاوية والدوران (Angular Physics)
//     this.angularVelocity = new THREE.Vector3(0, 0, 0); // السرعة الزاوية حول المحاور
//     this.friction = 0.988; // احتكاك اللباد المتناسق

//     this.createMesh();
//   }

//   // ... (اتركي دالتي generateBallTexture و drawNumberCircle و createMesh كما هي تماماً بدون تغيير) ...
//   generateBallTexture() {
//     const canvas = document.createElement("canvas");
//     canvas.width = 256; canvas.height = 128;
//     const ctx = canvas.getContext("2d");
//     const hexColor = "#" + this.baseColor.toString(16).padStart(6, "0");
//     if (this.isCueBall) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); } 
//     else {
//       ctx.fillStyle = hexColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
//       if (this.isStriped) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 54, canvas.width, 20); }
//       this.drawNumberCircle(ctx, 64, 64); this.drawNumberCircle(ctx, 192, 64);
//     }
//     return new THREE.CanvasTexture(canvas);
//   }

//   drawNumberCircle(ctx, x, y) {
//     ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2);
//     ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.fillStyle = "#000000";
//     ctx.font = "bold 20px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
//     ctx.fillText(this.number.toString(), x, y);
//   }

//   createMesh() {
//     const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
//     const texture = this.generateBallTexture();
//     const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.12, metalness: 0.08 });
//     this.mesh = new THREE.Mesh(geometry, material);
//     this.mesh.position.copy(this.position);
//     this.scene.add(this.mesh);
//   }

//   // 🔄 تحديث دالة الحركة لتشمل الدوران الفيزيائي الحقيقي
//   update(tableWidth, tableLength) {
//     // 1. تحديث الموقع بناءً على السرعة الخطية
//     this.position.x += this.velocity.x;
//     this.position.z += this.velocity.z;

//     // 2. تطبيق الاحتكاك لإبطاء السرعة الخطية والزاوية تدريجياً
//     this.velocity.x *= this.friction;
//     this.velocity.z *= this.friction;
//     this.angularVelocity.multiplyScalar(this.friction);

//     // قطع الحركة عند الاقتراب من الصفر منعاً للاهتزاز الاهتزازي الاستاتيكي
//     if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;
//     if (Math.abs(this.velocity.z) < 0.001) this.velocity.z = 0;

//     // 3. محاكاة التدحرج النقي: حساب السرعة الزاوية بناءً على اتجاه وسرعة الحركة الخطية
//     // الحركة على محور X تسبب دوراناً حول محور Z، والحركة على محور Z تسبب دوراناً حول محور X
//     if (this.velocity.length() > 0) {
//       this.angularVelocity.z = -this.velocity.x / this.radius;
//       this.angularVelocity.x = this.velocity.z / this.radius;
//     } else {
//       this.angularVelocity.set(0, 0, 0);
//     }

//     // 4. تطبيق الدوران المحسوب على مجسم الـ 3D (تعديل كواتيرنيون الدوران تلقائياً)
//     const deltaRotation = new THREE.Quaternion().setFromEuler(
//       new THREE.Euler(this.angularVelocity.x, this.angularVelocity.y, this.angularVelocity.z, 'XYZ')
//     );
//     this.mesh.quaternion.multiplyQuaternions(deltaRotation, this.mesh.quaternion);

//     // 5. حدود الطاولة والارتداد عن المصدات
//     const boundaryX = tableWidth / 2 - this.radius;
//     const boundaryZ = tableLength / 2 - this.radius;

//     if (this.position.x > boundaryX) { this.position.x = boundaryX; this.velocity.x = -this.velocity.x * 0.85; } 
//     else if (this.position.x < -boundaryX) { this.position.x = -boundaryX; this.velocity.x = -this.velocity.x * 0.85; }

//     if (this.position.z > boundaryZ) { this.position.z = boundaryZ; this.velocity.z = -this.velocity.z * 0.85; } 
//     else if (this.position.z < -boundaryZ) { this.position.z = -boundaryZ; this.velocity.z = -this.velocity.z * 0.85; }

//     // نقل الموقع المحدث للمجسم
//     this.mesh.position.copy(this.position);
//   }
// }

import * as THREE from "three";

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
    
    // 🔄 متجهات الفيزياء الدورانية المتقدمة
    this.angularVelocity = new THREE.Vector3(0, 0, 0); 
    this.friction = 0.988; // احتكاك التباطؤ العام

    this.createMesh();
  }

  generateBallTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const hexColor = "#" + this.baseColor.toString(16).padStart(6, "0");
    if (this.isCueBall) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); } 
    else {
      ctx.fillStyle = hexColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (this.isStriped) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 54, canvas.width, 20); }
      this.drawNumberCircle(ctx, 64, 64); this.drawNumberCircle(ctx, 192, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }

  drawNumberCircle(ctx, x, y) {
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.fillStyle = "#000000";
    ctx.font = "bold 20px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
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
    // 1. وضع حد أقصى للسرعة الخطية لمنع تأثير الاختراق
    const maxSpeed = 1.5; 
    if (this.velocity.length() > maxSpeed) {
      this.velocity.setLength(maxSpeed);
    }
    
    // حل الأستاذ: تحريك الموقع بمسافة مجهرية مقسومة على الخطوات
    this.position.x += this.velocity.x / subSteps;
    this.position.z += this.velocity.z / subSteps;

    // 2. فيزياء اللباد المتقدمة (تم تقسيم التأثير على subSteps لضمان الانسيابية)
    const slipX = this.velocity.x - (-this.angularVelocity.z * this.radius);
    const slipZ = this.velocity.z - (this.angularVelocity.x * this.radius);

    // تطبيق قوة الاحتكاك التصحيحية مقسومة على عدد الخطوات الجزئية
    this.velocity.x -= (slipX * 0.05) / subSteps;
    this.velocity.z -= (slipZ * 0.05) / subSteps;

    // 3. تطبيق التباطؤ العام للاحتكاك (تم تعديله رياضياً ليتناسب مع التكرار 5 مرات)
    // بدلاً من ضرب السرعة بالاحتكاك كاملاً 5 مرات، نأخذ الجذر الرياضي المتناسب مع الخطوات الجزئية
    const effectiveFriction = Math.pow(this.friction, 1 / subSteps);
    this.velocity.x *= effectiveFriction;
    this.velocity.z *= effectiveFriction;
    this.angularVelocity.multiplyScalar(effectiveFriction);

    if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;
    if (Math.abs(this.velocity.z) < 0.001) this.velocity.z = 0;

    // 4. تحديث الدوران المرئي بناءً على السرعة الزاوية المحسوبة
    const deltaRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(this.angularVelocity.x / subSteps, this.angularVelocity.y / subSteps, this.angularVelocity.z / subSteps, 'XYZ')
    );
    this.mesh.quaternion.multiplyQuaternions(deltaRotation, this.mesh.quaternion);

    // 5. حدود الطاولة والارتداد الفيزيائي (معامل الفقد 0.85)
    const boundaryX = tableWidth / 2 - this.radius;
    const boundaryZ = tableLength / 2 - this.radius;

    // الاصطدام بالحواف الطويلة
    if (this.position.x > boundaryX) { 
      this.position.x = boundaryX; 
      this.velocity.x = -this.velocity.x * 0.85; 
      this.angularVelocity.z = -this.angularVelocity.z * 0.85; 
      this.velocity.z += this.angularVelocity.y * this.radius * 0.5;
    } 
    else if (this.position.x < -boundaryX) { 
      this.position.x = -boundaryX; 
      this.velocity.x = -this.velocity.x * 0.85; 
      this.angularVelocity.z = -this.angularVelocity.z * 0.85; 
      this.velocity.z -= this.angularVelocity.y * this.radius * 0.5;
    }

    // الاصطدام بالحواف القصيرة
    if (this.position.z > boundaryZ) { 
      this.position.z = boundaryZ; 
      this.velocity.z = -this.velocity.z * 0.85; 
      this.angularVelocity.x = -this.angularVelocity.x * 0.85; 
      this.velocity.x -= this.angularVelocity.y * this.radius * 0.5;
    } 
    else if (this.position.z < -boundaryZ) { 
      this.position.z = -boundaryZ; 
      this.velocity.z = -this.velocity.z * 0.85; 
      this.angularVelocity.x = -this.angularVelocity.x * 0.85; 
      this.velocity.x += this.angularVelocity.y * this.radius * 0.5;
    }

    this.mesh.position.copy(this.position);
  }
}