// // import * as THREE from "three";
// // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// // import { Table } from "./Table.js";
// // import { Ball } from "./Ball.js";
// // import { Cue } from "./Cue.js";
// // import { Physics } from "./Physics.js"; // استيراد كلاس الفيزياء

// // class Game {
// //   constructor() {
// //     this.scene = new THREE.Scene();
// //     this.scene.background = new THREE.Color(0x111111);

// //     this.initCamera();
// //     this.initRenderer();
// //     this.initLights();

// //     this.table = new Table(this.scene);
    
// //     // إنشاء نسخة من كلاس الفيزياء وتمرير أبعاد الطاولة
// //     this.physics = new Physics(this.table.width, this.table.length);

// //     this.balls = [];
// //     this.createAllBalls();
// //     this.cue = new Cue(this.scene, this.cueBall);
// //     this.cueAngle = 0;
// //     this.initControls();
// //     window.addEventListener("resize", () => this.onWindowResize());
    
// //     this.animate = this.animate.bind(this);

// //     // ربط زر التسديد لإطلاق الكرة البيضاء
// //     const shootBtn = document.getElementById("btn-shoot");
// //     if (shootBtn) {
// //       shootBtn.addEventListener("click", () => {
// //         this.cueBall.velocity.x = 2.5; // سرعة الاندفاع نحو الكرات
// //         this.cueBall.velocity.z = 0.02; // انحراف طفيف لتوزيع التصادم بشكل عشوائي واقعي
// //       });
// //     }

// //     this.animate();
// //   }

// //   initCamera() {
// //     this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// //     this.camera.position.set(0, 15, 22);
// //   }

// //   initRenderer() {
// //     this.canvas = document.getElementById("billardCanvas") || undefined;
// //     this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
// //     this.renderer.setSize(window.innerWidth, window.innerHeight);
// //     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// //     if (!this.canvas) document.body.appendChild(this.renderer.domElement);
// //   }

// //   initLights() {
// //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
// //     this.scene.add(ambientLight);
// //     const topLight = new THREE.DirectionalLight(0xffffff, 0.9);
// //     topLight.position.set(0, 20, 0);
// //     this.scene.add(topLight);
// //   }

// //   createAllBalls() {
// //     const ballRadius = 0.25;
// //     this.cueBall = new Ball(this.scene, -5, 0, ballRadius, 0, 0xffffff, false);
// //     const poolBallsConfig = [
// //       { num: 1, color: 0xffd700, striped: false },
// //       { num: 9, color: 0xffd700, striped: true },
// //       { num: 2, color: 0x0000ff, striped: false },
// //       { num: 10, color: 0x0000ff, striped: true },
// //       { num: 8, color: 0x000000, striped: false },
// //       { num: 3, color: 0xff0000, striped: false },
// //       { num: 11, color: 0xff0000, striped: true },
// //       { num: 4, color: 0x4b0082, striped: false },
// //       { num: 12, color: 0x4b0082, striped: true },
// //       { num: 5, color: 0x222222, striped: false },
// //       { num: 13, color: 0x8b0000, striped: true },
// //       { num: 6, color: 0x008000, striped: false },
// //       { num: 14, color: 0x008000, striped: true },
// //       { num: 15, color: 0x222222, striped: true },
// //       { num: 7, color: 0x8b0000, striped: false },
// //     ];

// //     const startX = 4.0;
// //     const startZ = 0.0;
// //     let index = 0;
// //     const rowSpacing = ballRadius * 2 * Math.cos(Math.PI / 6);

// //     for (let row = 0; row < 5; row++) {
// //       for (let col = 0; col <= row; col++) {
// //         const x = startX + row * rowSpacing;
// //         const z = startZ + (col - row / 2) * (ballRadius * 2.02);
// //         const config = poolBallsConfig[index];

// //         const ball = new Ball(this.scene, x, z, ballRadius, config.num, config.color, config.striped);
// //         this.balls.push(ball);
// //         index++;
// //       }
// //     }
// //   }

// //   initControls() {
// //     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
// //     this.controls.enableDamping = true;
// //     this.controls.dampingFactor = 0.05;
// //     this.controls.minDistance = 3;
// //     this.controls.maxDistance = 50;
// //   }

// //   onWindowResize() {
// //     this.camera.aspect = window.innerWidth / window.innerHeight;
// //     this.camera.updateProjectionMatrix();
// //     this.renderer.setSize(window.innerWidth, window.innerHeight);
// //   }

// //   animate() {
// //     requestAnimationFrame(this.animate);
// //     if (this.controls) this.controls.update();

// //     // تشغيل حسابات الفيزياء من الكلاس المستقل قبل الرسم مرئياً
// //     if (this.physics) {
// //       this.physics.updateCollisions(this.cueBall, this.balls);
// //     }

// //     this.cueBall.update(this.table.width, this.table.length);
// //     this.balls.forEach((ball) => ball.update(this.table.width, this.table.length));

// //     if (this.cue) {
// //       this.cue.update(this.cueAngle, true);
// //     }

// //     this.renderer.render(this.scene, this.camera);
// //   }
// // }

// // window.addEventListener("DOMContentLoaded", () => {
// //   new Game();
// // });

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Table } from "./Table.js";
// import { Ball } from "./Ball.js";
// import { Cue } from "./Cue.js";
// import { Physics } from "./Physics.js";

// class Game {
//   constructor() {
//     this.scene = new THREE.Scene();
//     this.scene.background = new THREE.Color(0x111111);

//     this.initCamera();
//     this.initRenderer();
//     this.initLights();

//     this.table = new Table(this.scene);
//     this.physics = new Physics(this.table.width, this.table.length);

//     this.balls = [];
//     this.createAllBalls();
//     this.cue = new Cue(this.scene, this.cueBall);
//     this.cueAngle = 0; // الزاوية الابتدائية للعصا
    
//     this.initControls(); // استدعاء دالة التحكم بالكيبورد والماوس
    
//     window.addEventListener("resize", () => this.onWindowResize());
//     this.animate = this.animate.bind(this);
//     this.animate();
//   }

//   initCamera() {
//     this.camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000,
//     );
//     this.camera.position.set(0, 15, 22);
//   }

//   initRenderer() {
//     this.canvas = document.getElementById("billardCanvas") || undefined;
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvas,
//       antialias: true,
//     });
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     if (!this.canvas) document.body.appendChild(this.renderer.domElement);
//   }

//   initLights() {
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//     this.scene.add(ambientLight);
//     const topLight = new THREE.DirectionalLight(0xffffff, 0.9);
//     topLight.position.set(0, 20, 0);
//     this.scene.add(topLight);
//   }

//   createAllBalls() {
//     const ballRadius = 0.25;
//     this.cueBall = new Ball(this.scene, -5, 0, ballRadius, 0, 0xffffff, false);
//     const poolBallsConfig = [
//       { num: 1, color: 0xffd700, striped: false },
//       { num: 9, color: 0xffd700, striped: true },
//       { num: 2, color: 0x0000ff, striped: false },
//       { num: 10, color: 0x0000ff, striped: true },
//       { num: 8, color: 0x000000, striped: false },
//       { num: 3, color: 0xff0000, striped: false },
//       { num: 11, color: 0xff0000, striped: true },
//       { num: 4, color: 0x4b0082, striped: false },
//       { num: 12, color: 0x4b0082, striped: true },
//       { num: 5, color: 0x222222, striped: false },
//       { num: 13, color: 0x8b0000, striped: true },
//       { num: 6, color: 0x008000, striped: false },
//       { num: 14, color: 0x008000, striped: true },
//       { num: 15, color: 0x222222, striped: true },
//       { num: 7, color: 0x8b0000, striped: false },
//     ];

//     const startX = 4.0;
//     const startZ = 0.0;
//     let index = 0;
//     const rowSpacing = ballRadius * 2 * Math.cos(Math.PI / 6);

//     for (let row = 0; row < 5; row++) {
//       for (let col = 0; col <= row; col++) {
//         const x = startX + row * rowSpacing;
//         const z = startZ + (col - row / 2) * (ballRadius * 2.02);

//         const config = poolBallsConfig[index];

//         const ball = new Ball(
//           this.scene,
//           x,
//           z,
//           ballRadius,
//           config.num,
//           config.color,
//           config.striped,
//         );
//         this.balls.push(ball);

//         index++;
//       }
//     }
//   }

//   initControls() {
//     // دوران الكاميرا بالماوس حول الطاولة
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.enableDamping = true;
//     this.controls.dampingFactor = 0.05;
//     this.controls.minDistance = 3;
//     this.controls.maxDistance = 50;

//     // 💥 إضافة الاستماع لأزرار لوحة المفاتيح هنا 💥
//     window.addEventListener("keydown", (event) => {
//       switch (event.key) {
        
//         // السهم الأيسر: تدوير العصا عكس عقارب الساعة
//         case "ArrowLeft":
//           this.cueAngle += 0.06; 
//           break;
          
//         // السهم الأيمن: تدوير العصا مع عقارب الساعة
//         case "ArrowRight":
//           this.cueAngle -= 0.06;
//           break;
          
//         // زر المسافة (Spacebar): إطلاق الكرة باتجاه زاوية العصا الحالية
//         case " ":
//           event.preventDefault(); // منع قفز الشاشة لأسفل
//           const force = 2.8; // قوة الضربة الفيزيائية
          
//           // حساب اتجاه السرعة بناءً على زاوية العصا
//           this.cueBall.velocity.x = Math.cos(this.cueAngle) * force;
//           this.cueBall.velocity.z = Math.sin(this.cueAngle) * force;
//           break;

//         // زر R للرص (سنفعله برمجياً لاحقاً)
//         case "r":
//         case "R":
//           console.log("سيتم إعادة الرص هنا...");
//           break;
//       }
//     });
//   }

//   onWindowResize() {
//     this.camera.aspect = window.innerWidth / window.innerHeight;
//     this.camera.updateProjectionMatrix();
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//   }

//   animate() {
//     requestAnimationFrame(this.animate);
//     if (this.controls) this.controls.update();

//     // تشغيل حسابات فيزياء التصادم من الكلاس المستقل
//     if (this.physics) {
//       this.physics.updateCollisions(this.cueBall, this.balls);
//     }

//     this.cueBall.update(this.table.width, this.table.length);
//     this.balls.forEach((ball) =>
//       ball.update(this.table.width, this.table.length),
//     );
    
//     // تحديث زاوية وموقع العصا بناءً على المدخلات الجديدة
//     if (this.cue) {
//       this.cue.update(this.cueAngle, true);
//     }

//     this.renderer.render(this.scene, this.camera);
//   }
// }

// window.addEventListener("DOMContentLoaded", () => {
//   new Game();
// });

// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Table } from "./Table.js";
// import { Ball } from "./Ball.js";
// import { Cue } from "./Cue.js";
// import { Physics } from "./Physics.js";

// class Game {
//   constructor() {
//     this.scene = new THREE.Scene();
//     this.scene.background = new THREE.Color(0x111111);

//     this.initCamera();
//     this.initRenderer();
//     this.initLights();

//     this.table = new Table(this.scene);
//     this.physics = new Physics(this.table.width, this.table.length);

//     this.balls = [];
//     this.createAllBalls();
//     this.cue = new Cue(this.scene, this.cueBall);
    
//     this.cueAngle = 0;      // زاوية الدوران الأفقي للعصا
//     this.spinOffset = 0;    // قيمة الدوران العمودي المضاف (Top/Back spin)
//     this.isCharging = false;

//     this.initControls();
    
//     window.addEventListener("resize", () => this.onWindowResize());
//     this.animate = this.animate.bind(this);
//     this.animate();
//   }

//   initCamera() {
//     this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//     this.camera.position.set(0, 15, 22);
//   }

//   initRenderer() {
//     this.canvas = document.getElementById("billardCanvas") || undefined;
//     this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     if (!this.canvas) document.body.appendChild(this.renderer.domElement);
//   }

//   initLights() {
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//     this.scene.add(ambientLight);
//     const topLight = new THREE.DirectionalLight(0xffffff, 0.9);
//     topLight.position.set(0, 20, 0);
//     this.scene.add(topLight);
//   }

//   createAllBalls() {
//     const ballRadius = 0.25;
//     this.cueBall = new Ball(this.scene, -5, 0, ballRadius, 0, 0xffffff, false);
//     const poolBallsConfig = [
//       { num: 1, color: 0xffd700, striped: false }, { num: 9, color: 0xffd700, striped: true },
//       { num: 2, color: 0x0000ff, striped: false }, { num: 10, color: 0x0000ff, striped: true },
//       { num: 8, color: 0x000000, striped: false }, { num: 3, color: 0xff0000, striped: false },
//       { num: 11, color: 0xff0000, striped: true }, { num: 4, color: 0x4b0082, striped: false },
//       { num: 12, color: 0x4b0082, striped: true }, { num: 5, color: 0x222222, striped: false },
//       { num: 13, color: 0x8b0000, striped: true }, { num: 6, color: 0x008000, striped: false },
//       { num: 14, color: 0x008000, striped: true }, { num: 15, color: 0x222222, striped: true },
//       { num: 7, color: 0x8b0000, striped: false },
//     ];

//     const startX = 4.0; const startZ = 0.0; let index = 0;
//     const rowSpacing = ballRadius * 2 * Math.cos(Math.PI / 6);

//     for (let row = 0; row < 5; row++) {
//       for (let col = 0; col <= row; col++) {
//         const x = startX + row * rowSpacing;
//         const z = startZ + (col - row / 2) * (ballRadius * 2.02);
//         const config = poolBallsConfig[index];
//         const ball = new Ball(this.scene, x, z, ballRadius, config.num, config.color, config.striped);
//         this.balls.push(ball);
//         index++;
//       }
//     }
//   }

//   initControls() {
//     this.controls = new OrbitControls(this.camera, this.renderer.domElement);
//     this.controls.enableDamping = true;
//     this.controls.dampingFactor = 0.05;

//     window.addEventListener("keydown", (event) => {
//       // تدوير أفقي للعصا
//       if (event.key === "ArrowLeft") this.cueAngle += 0.05;
//       if (event.key === "ArrowRight") this.cueAngle -= 0.05;
      
//       // شحن تأثير دوران الكرة (W للـ Topspin و S للـ Backspin)
//       if (event.key === "ArrowUp") { this.spinOffset += 0.1; console.log("شحن توب سبين للأمام"); }
//       if (event.key === "ArrowDown") { this.spinOffset -= 0.1; console.log("شحن باك سبين للخلف"); }

//       if (event.key === " ") {
//         event.preventDefault();
//         if (this.cue && !this.cue.isShooting) {
//           this.isCharging = true;
//         }
//       }
//     });

//     window.addEventListener("keyup", (event) => {
//       if (event.key === " " && this.isCharging) {
//         this.isCharging = false;

//         if (this.cue) {
//           const calculatedForce = this.cue.strokeOffset * 1.8; 
//           this.cue.release();

//           if (calculatedForce > 0.05) {
//             // القوة الخطية للاندفاع
//             this.cueBall.velocity.x = Math.cos(this.cueAngle) * calculatedForce;
//             this.cueBall.velocity.z = Math.sin(this.cueAngle) * calculatedForce;

//             // 🔥 تطبيق الدوران المغزلي المباشر للكرة بناءً على تأثير السهم العلوي والسفلي المشحون!
//             this.cueBall.angularVelocity.z = -Math.cos(this.cueAngle) * (this.spinOffset * 5);
//             this.cueBall.angularVelocity.x = Math.sin(this.cueAngle) * (this.spinOffset * 5);

//             // إعادة تصفير التأثير للضربة التالية
//             this.spinOffset = 0;
//           }
//         }
//       }
//     });
//   }

//   onWindowResize() {
//     this.camera.aspect = window.innerWidth / window.innerHeight;
//     this.camera.updateProjectionMatrix();
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//   }

//   animate() {
//     requestAnimationFrame(this.animate);
//     if (this.controls) this.controls.update();

//     if (this.physics) {
//       this.physics.updateCollisions(this.cueBall, this.balls);
//     }

//     this.cueBall.update(this.table.width, this.table.length);
//     this.balls.forEach((ball) => ball.update(this.table.width, this.table.length));

//     // إخفاء وإظهار العصا الذكي بناءً على حالة الحركة لمنع التشتت البصري العشوائي
//     if (this.cue) {
//       const isMoving = this.cueBall.velocity.length() > 0.005 || this.balls.some(b => b.velocity.length() > 0.005);
//       if (isMoving) {
//         this.cue.mesh.visible = false;
//       } else {
//         this.cue.mesh.visible = true;
//         if (this.isCharging) this.cue.chargePower();
//         this.cue.update(this.cueAngle);
//       }
//     }

//     this.renderer.render(this.scene, this.camera);
//   }
// }

// window.addEventListener("DOMContentLoaded", () => { new Game(); });

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
    
    this.cueAngle = 0;      // زاوية الدوران الأفقي للعصا
    this.spinOffset = 0;    // قيمة الدوران العمودي المضاف (Top/Back spin)
    this.isCharging = false;

    this.initControls();
    
    window.addEventListener("resize", () => this.onWindowResize());
    // 🔥 إنشاء لوحة التحكم المرئية على الشاشة بأسلوب الأستاذ
    this.gui = new GUI({ title: "Physics Controls" });
    
    // نضع لوحة التحكم في زاوية أنيقة
    this.gui.domElement.style.position = "absolute";
    this.gui.domElement.style.top = "70px"; // أسفل شريط الكرات الساقطة
    this.gui.domElement.style.right = "10px";

    // إعداد متغيرات التحكم الافتراضية لربطها بالـ Sliders
    this.physicsParams = {
      friction: 0.985,      // معامل احتكاك وتباطؤ الكرة (Friction)
      restitution: 0.94  ,   // معامل المرونة والارتداد عند التصادم (Restitution)
      topBackSpin: 0.0, // 🔥 إضافة دوران أمامي/خلفي افتراضي
      sideSpin: 0.0     // 🔥 إضافة دوران جانبي افتراضي
    };
    // إضافة السلايدرات الخاصة بالدوران إلى اللوحة المرئية على الشاشة
    this.gui.add(this.physicsParams, "topBackSpin", -2.0, 2.0, 0.1)
      .name("Top / Back Spin")
      .onChange((value) => {
        // يتم حفظ القيمة لتطبيقها لحظة الضربة
      });

    this.gui.add(this.physicsParams, "sideSpin", -2.0, 2.0, 0.1)
      .name("Side Spin")
      .onChange((value) => {
        // يتم حفظ القيمة لتطبيقها لحظة الضربة
      });

    // إضافة الـ Slider الخاص بالاحتكاك (بين 0.90 و 1.0)
    this.gui.add(this.physicsParams, "friction", 0.90, 2.0, 0.001)
      .name("Friction (الاحتكاك)")
      .onChange((value) => {
        // تحديث قيمة الاحتكاك فوراً داخل الكرة البيضاء وكل الكرات الملونة
        this.cueBall.friction = value;
        this.balls.forEach(ball => ball.friction = value);
      });

    // إضافة الـ Slider الخاص بالارتداد (بين 0.5 و 1.0)
    this.gui.add(this.physicsParams, "restitution", 0.5, 2.0, 0.01)
      .name("Restitution (الارتداد)")
      .onChange((value) => {
        // إذا كنتِ قد حفظتِ قيمة معامل الارتداد داخل كلاس الفيزياء، نقوم بتحديثها هنا فوراً
        if (this.physics) {
          this.physics.restitution = value; 
        }
      });
    this.animate = this.animate.bind(this);
    this.animate();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 15, 22);
  }

  initRenderer() {
    this.canvas = document.getElementById("billardCanvas") || undefined;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
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
    const poolBallsConfig = [
      { num: 1, color: 0xffd700, striped: false }, { num: 9, color: 0xffd700, striped: true },
      { num: 2, color: 0x0000ff, striped: false }, { num: 10, color: 0x0000ff, striped: true },
      { num: 8, color: 0x000000, striped: false }, { num: 3, color: 0xff0000, striped: false },
      { num: 11, color: 0xff0000, striped: true }, { num: 4, color: 0x4b0082, striped: false },
      { num: 12, color: 0x4b0082, striped: true }, { num: 5, color: 0x222222, striped: false },
      { num: 13, color: 0x8b0000, striped: true }, { num: 6, color: 0x008000, striped: false },
      { num: 14, color: 0x008000, striped: true }, { num: 15, color: 0x222222, striped: true },
      { num: 7, color: 0x8b0000, striped: false },
    ];

    const startX = 4.0; const startZ = 0.0; let index = 0;
    const rowSpacing = ballRadius * 2 * Math.cos(Math.PI / 6);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const x = startX + row * rowSpacing;
        const z = startZ + (col - row / 2) * (ballRadius * 2.02);
        const config = poolBallsConfig[index];
        const ball = new Ball(this.scene, x, z, ballRadius, config.num, config.color, config.striped);
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
      // تدوير أفقي للعصا بالأسهم (يمين ويسار) أو الحروف (A و D) لمنع أي تعارض
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") this.cueAngle += 0.05;
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") this.cueAngle -= 0.05;
      
      // 🔥 تم التعديل: شحن تأثير دوران الكرة باستخدام الحروف W و S بدلاً من الأسهم
      if (event.key === "w" || event.key === "W") { 
        this.spinOffset += 0.1; 
        console.log("🟢 شحن توب سبين للأمام | القيمة الحالية: " + this.spinOffset.toFixed(2)); 
      }
      if (event.key === "s" || event.key === "S") { 
        this.spinOffset -= 0.1; 
        console.log("🔴 شحن باك سبين للخلف | القيمة الحالية: " + this.spinOffset.toFixed(2)); 
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
          // 1. حساب القوة الحركية بشكل أُسي لتعطي فارقاً ملموساً بين الضربة الخفيفة والقوية
          const calculatedForce = Math.pow(this.cue.strokeOffset, 2) * 2.8;
          this.cue.release();

          if (calculatedForce > 0.02) {
            // 2. القوة الخطية للاندفاع (حركة الكرة للأمام بناءً على زاوية العصا)
            this.cueBall.velocity.x = Math.cos(this.cueAngle) * calculatedForce;
            this.cueBall.velocity.z = Math.sin(this.cueAngle) * calculatedForce;

            // 🔥 3. تطبيق الدوران المغزلي (Spin) القادم مباشرة من السلايدرات (Physics Controls) فوراً عند الضربة:
            
            // أ) الدوران العلوي والسفلي (Top / Back Spin): يؤثر على محاور الدوران الأفريقية X و Z المتعامدة مع اتجاه الحركة
            this.cueBall.angularVelocity.x = -Math.sin(this.cueAngle) * this.physicsParams.topBackSpin * calculatedForce;
            this.cueBall.angularVelocity.z = Math.cos(this.cueAngle) * this.physicsParams.topBackSpin * calculatedForce;

            // ب) الدوران الجانبي (Side Spin): يجعل الكرة تدور حول المحور العامودي Y (غزل جانبي يغير زاوية الارتداد عن الجدران)
            this.cueBall.angularVelocity.y = this.physicsParams.sideSpin * calculatedForce;

            console.log(`⚡ تم تسديد الضربة بنجاح! القوة: ${calculatedForce.toFixed(2)} | الدوران العلوي: ${this.physicsParams.topBackSpin} | الدوران الجانبي: ${this.physicsParams.sideSpin}`);
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

  // 🔥 دالة مخصصة لرسم الكرة الساقطة وإضافتها للشريط العلوي على الشاشة
  addBallToUI(ballNumber, ballColor, isStriped) {
    const bar = document.getElementById("fallen-balls-bar");
    if (!bar) return;

    // إنشاء عنصر دائري يمثل الكرة
    const ballUI = document.createElement("div");
    const hexColor = "#" + ballColor.toString(16).padStart(6, "0");
    
    // تصميم شكل الكرة باستخدام CSS المباشر لتبدو ثلاثية الأبعاد وواقعية
    ballUI.style.width = "25px";
    ballUI.style.height = "25px";
    ballUI.style.borderRadius = "50%";
    ballUI.style.display = "flex";
    ballUI.style.alignItems = "center";
    ballUI.style.justifyContent = "center";
    ballUI.style.fontSize = "11px";
    ballUI.style.fontWeight = "bold";
    ballUI.style.color = ballNumber === 8 || ballColor === 0x000000 ? "white" : "black";
    ballUI.style.boxShadow = "inset -3px -3px 6px rgba(0,0,0,0.4), 2px 2px 4px rgba(0,0,0,0.3)";
    
    // إذا كانت الكرة مخططة (Striped)، نصنع لها تأثيراً مخططاً، وإلا نلونها بالكامل (Solid)
    if (isStriped) {
      ballUI.style.background = `linear-gradient(to bottom, #ffffff 20%, ${hexColor} 20%, ${hexColor} 80%, #ffffff 80%)`;
    } else {
      ballUI.style.background = hexColor;
    }

    // كتابة رقم الكرة في منتصف الدائرة البيضاء الصغيرة
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
    bar.appendChild(ballUI); // إضافتها للشريط العلوي
  }
  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.controls) this.controls.update();

    if (this.physics) {
      // 🔥 تطبيق حل الأستاذ: تقسيم الخطوة الزمنية (Sub-stepping) داخل الفريم الواحد
      // بدل ما تتحرك الكرة قفزة واحدة كبيرة (مثلاً 0.3)، رح تتحرك 5 قفزات مجهرية (0.06 بكل قفزة)
      const subSteps = 5;

      for (let i = 0; i < subSteps; i++) {
        // أ) تحديث واحتساب الاصطدامات بين الكرات في هذه الحركة المجهرية
        this.physics.updateCollisions(this.cueBall, this.balls, this.table.width, this.table.length);

        // ب) تحريك الكرة البيضاء وباقي الكرات مسافة قصيرة جداً (نمرر عدد الأجزاء للدالة)
        this.cueBall.update(this.table.width, this.table.length, subSteps);
        this.balls.forEach((ball) => ball.update(this.table.width, this.table.length, subSteps));
      }

      // 2. فحص الجيوب (يكون مرة واحدة في الفريم بعد نهاية الحركات الجزئية للتأكد من السقوط)
      const fallenBalls = this.physics.checkPockets(this.cueBall, this.balls, this.table.pockets);
      
      if (fallenBalls.length > 0) {
        fallenBalls.forEach((ball) => {
          this.addBallToUI(ball.number, ball.baseColor, ball.isStriped);
          this.scene.remove(ball.mesh); 
          this.balls = this.balls.filter((b) => b !== ball); 
          console.log(`🎉 رائع! سقطت الكرة رقم ${ball.number} في الجيب.`);
        });
      }
    }

    // 3. تحديث حركة العصا (خارج حلقة التكرار لأنها لا تتعلق بفيزياء الاصطدام السريع)
    if (this.cue) {
      const isMoving = this.cueBall.velocity.length() > 0.005 || this.balls.some(b => b.velocity.length() > 0.005);
      if (isMoving) {
        this.cue.mesh.visible = false;
      } else {
        this.cue.mesh.visible = true;
        if (this.isCharging) this.cue.chargePower();
        this.cue.update(this.cueAngle);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener("DOMContentLoaded", () => { new Game(); });