// export class Physics {
//   constructor(tableWidth, tableLength) {
//     this.tableWidth = tableWidth;
//     this.tableLength = tableLength;
//     this.restitution = 0.94; // معامل الاسترداد الفيزيائي لكرات البلياردو (e)
//   }

//   // حساب التصادم الواقعي وتبادل كميات الحركة مع احتساب الفقد في الطاقة
//   resolveBallCollision(ball1, ball2) {
//     const dx = ball2.position.x - ball1.position.x;
//     const dz = ball2.position.z - ball1.position.z;
//     const distance = Math.sqrt(dx * dx + dz * dz);
//     const minDist = ball1.radius + ball2.radius;

//     if (distance < minDist) {
//       if (distance === 0) return;

//       // 1. حساب ناقل الوحدة العمودي والمماسي
//       const nx = dx / distance;
//       const nz = dz / distance;
//       const tx = -nz;
//       const tz = nx;

//       // 2. إسقاط السرعات الحالية على المحاور العمودية والمماسية (Dot Product)
//       const v1n = ball1.velocity.x * nx + ball1.velocity.z * nz;
//       const v1t = ball1.velocity.x * tx + ball1.velocity.z * tz;
//       const v2n = ball2.velocity.x * nx + ball2.velocity.z * nz;
//       const v2t = ball2.velocity.x * tx + ball2.velocity.z * tz;

//       // 3. تطبيق قانون التصادم غير المرن جزئياً (حساب السرعات العمودية الجديدة بعد الفقد)
//       const e = this.restitution;
//       const v1n_after = ((1 - e) * v1n + (1 + e) * v2n) / 2;
//       const v2n_after = ((1 + e) * v1n + (1 - e) * v2n) / 2;

//       // 4. إعادة تحويل السرعات الناتجة إلى المحاور الأساسية X و Z
//       ball1.velocity.x = v1n_after * nx + v1t * tx;
//       ball1.velocity.z = v1n_after * nz + v1t * tz;
//       ball2.velocity.x = v2n_after * nx + v2t * tx;
//       ball2.velocity.z = v2n_after * nz + v2t * tz;

//       // 5. تصحيح الموضع استاتيكياً لمنع التداخل والالتصاق الناتجة عن مصفوفة الإطارات
//       const overlap = minDist - distance;
//       ball1.position.x -= nx * (overlap / 2);
//       ball1.position.z -= nz * (overlap / 2);
//       ball2.position.x += nx * (overlap / 2);
//       ball2.position.z += nz * (overlap / 2);
//     }
//   }

//   // تحديث التصادمات لجميع الكرات معاً
//   updateCollisions(cueBall, ballsArray) {
//     const allBalls = [cueBall, ...ballsArray];
//     for (let i = 0; i < allBalls.length; i++) {
//       for (let j = i + 1; j < allBalls.length; j++) {
//         this.resolveBallCollision(allBalls[i], allBalls[j]);
//       }
//     }
//   }
// }


export class Physics {
  constructor(tableWidth, tableLength) {
    this.tableWidth = tableWidth;
    this.tableLength = tableLength;
    this.restitution = 0.94; // التمرير الافتراضي القابل للتغيير ديناميكياً من الـ GUI
  }

  // 🔥 تحديث الدالة الرئيسية: تم حذف حلقة التكرار الداخلية (subSteps = 45) القديمة
  // لأن التقسيم الزمني الميكانيكي صار يتم بشكل احترافي ومنظم من ملف main.js
  updateCollisions(cueBall, balls) {
    const allBalls = [cueBall, ...balls];

    // فحص التصادم بين كل كرتين مرة واحدة في الحركة الجزئية
    for (let i = 0; i < allBalls.length; i++) {
      for (let j = i + 1; j < allBalls.length; j++) {
        this.checkAndResolveCollision(allBalls[i], allBalls[j]);
      }
    }
  }

  // الدالة الفيزيائية التي تحسب تبادل الزخم ومنع التداخل الاستاتيكي
  checkAndResolveCollision(ballA, ballB) {
    const minDistance = ballA.radius + ballB.radius;
    
    // حساب المسافة الحالية بين مركزي الكرتين على محوري X و Z
    const dx = ballB.position.x - ballA.position.x;
    const dz = ballB.position.z - ballA.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // إذا حدث تلامس أو تداخل حقيقي بين الكرتين
    if (distance < minDistance && distance > 0) {
      
      // 1. حل مشكلة التداخل الهندسي (Overlap Correction) لضمان عدم الالتصاق
      const overlap = minDistance - distance;
      const nx = dx / distance;
      const nz = dz / distance;

      // دفع الكرتين بعيداً عن بعضهما بمقدار نصف التداخل تماماً بناءً على ناقل الوحدة
      ballA.position.x -= nx * overlap * 0.5;
      ballA.position.z -= nz * overlap * 0.5;
      ballB.position.x += nx * overlap * 0.5;
      ballB.position.z += nz * overlap * 0.5;

      // 2. حساب السرعات النسبية وتبادل كمية الحركة (Elastic Collision Physics)
      const rvx = ballB.velocity.x - ballA.velocity.x;
      const rvz = ballB.velocity.z - ballA.velocity.z;

      // الضرب القياسي لحساب السرعة العمودية على سطح التصادم
      const velAlongNormal = rvx * nx + rvz * nz;

      // إذا كانت الكرات تتحرك باتجاه بعضها البعض (velAlongNormal < 0)
      if (velAlongNormal < 0) {
        // القراءة من القيمة الديناميكية للـ Slider بدلاً من الرقم الثابت
        const e = this.restitution;
        const impulseScalar = -(1 + e) * velAlongNormal / 2; // الكتل متساوية (1 + 1 = 2)

        // تحديث متجهات السرعة الخطية الجديدة بعد الصدمة مباشرة
        ballA.velocity.x -= nx * impulseScalar;
        ballA.velocity.z -= nz * impulseScalar;
        ballB.velocity.x += nx * impulseScalar;
        ballB.velocity.z += nz * impulseScalar;
      }
    }
  }

  // 🔥 دالة فحص سقوط الكرات داخل جيوب طاولتكِ الستة
  checkPockets(cueBall, balls, tablePockets) {
    const fallenBalls = [];
    const allBalls = [cueBall, ...balls];

    allBalls.forEach((ball) => {
      tablePockets.forEach((pocket) => {
        // حساب المسافة بين مركز الكرة ومركز الحفرة على محوري X و Z
        const dx = ball.position.x - pocket.x;
        const dz = ball.position.z - pocket.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // إذا دخل مركز الكرة ضمن نطاق نصف قطر الحفرة
        if (distance < pocket.radius) {
          if (ball.isCueBall) {
            // ⚪ إعادة رص الكرة البيضاء في موقعها الابتدائي عند السقوط
            ball.velocity.set(0, 0, 0);
            ball.angularVelocity.set(0, 0, 0);
            ball.position.set(-6, ball.radius + 0.02, 0); 
            console.log("⚪ سقطت الكرة البيضاء! تم إعادة رصها.");
          } else {
            // 🔴 تسجيل الكرة الملونة لحذفها
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