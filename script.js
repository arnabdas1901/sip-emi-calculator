const formatINR = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0
    }).format(Math.round(value));
  };
  
  const sipAmount = document.getElementById("sipAmount");
  const sipRate = document.getElementById("sipRate");
  const sipYears = document.getElementById("sipYears");
  
  const loanAmount = document.getElementById("loanAmount");
  const loanRate = document.getElementById("loanRate");
  const loanYears = document.getElementById("loanYears");
  
  const sipAmountValue = document.getElementById("sipAmountValue");
  const sipRateValue = document.getElementById("sipRateValue");
  const sipYearsValue = document.getElementById("sipYearsValue");
  
  const loanAmountValue = document.getElementById("loanAmountValue");
  const loanRateValue = document.getElementById("loanRateValue");
  const loanYearsValue = document.getElementById("loanYearsValue");
  
  const sipInvested = document.getElementById("sipInvested");
  const sipReturns = document.getElementById("sipReturns");
  const sipFutureValue = document.getElementById("sipFutureValue");
  const sipInsight = document.getElementById("sipInsight");
  const sipError = document.getElementById("sipError");
  
  const emiMonthly = document.getElementById("emiMonthly");
  const emiInterest = document.getElementById("emiInterest");
  const emiTotal = document.getElementById("emiTotal");
  const emiInsight = document.getElementById("emiInsight");
  const emiError = document.getElementById("emiError");
  
  const sipCanvas = document.getElementById("sipChart");
  const emiCanvas = document.getElementById("emiChart");
  
  const sipCtx = sipCanvas.getContext("2d");
  const emiCtx = emiCanvas.getContext("2d");
  
  function animateNumber(element, targetValue, prefix = "₹") {
    const duration = 450;
    const startValue = Number(element.dataset.current || 0);
    const startTime = performance.now();
  
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * eased;
      element.textContent = prefix + formatINR(current);
  
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.dataset.current = targetValue;
      }
    }
  
    requestAnimationFrame(update);
  }
  
  function drawDoughnut(canvasCtx, valueA, valueB, colorA, colorB) {
    const canvas = canvasCtx.canvas;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvasCtx.clearRect(0, 0, width, height);
  
    const total = valueA + valueB;
    const cx = width / 2;
    const cy = height / 2 + 8;
    const radius = Math.min(width, height) * 0.30;
    const lineWidth = 22;
  
    if (!total || total <= 0) {
      canvasCtx.fillStyle = "rgba(255,255,255,0.45)";
      canvasCtx.font = "600 14px Inter, sans-serif";
      canvasCtx.textAlign = "center";
      canvasCtx.fillText("No chart data", cx, cy);
      return;
    }
  
    const start = -Math.PI / 2;
    const angleA = (valueA / total) * Math.PI * 2;
  
    canvasCtx.beginPath();
    canvasCtx.arc(cx, cy, radius, 0, Math.PI * 2);
    canvasCtx.strokeStyle = "rgba(255,255,255,0.08)";
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.stroke();
  
    canvasCtx.beginPath();
    canvasCtx.arc(cx, cy, radius, start, start + angleA);
    canvasCtx.strokeStyle = colorA;
    canvasCtx.lineCap = "round";
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.stroke();
  
    canvasCtx.beginPath();
    canvasCtx.arc(cx, cy, radius, start + angleA, start + Math.PI * 2);
    canvasCtx.strokeStyle = colorB;
    canvasCtx.lineCap = "round";
    canvasCtx.lineWidth = lineWidth;
    canvasCtx.stroke();
  
    canvasCtx.fillStyle = "#edf4ff";
    canvasCtx.font = "700 16px Inter, sans-serif";
    canvasCtx.textAlign = "center";
    canvasCtx.fillText("Breakdown", cx, cy - 4);
  
    canvasCtx.fillStyle = "rgba(237,244,255,0.72)";
    canvasCtx.font = "500 12px Inter, sans-serif";
    canvasCtx.fillText("Invested vs Returns", cx, cy + 16);
  }
  
  function setError(element, message) {
    element.textContent = message;
    const card = element.closest(".panel");
    if (message && card) {
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
    }
  }
  
  function calculateSIP() {
    const monthly = Number(sipAmount.value);
    const annualRate = Number(sipRate.value);
    const years = Number(sipYears.value);
  
    if (!monthly || monthly <= 0 || annualRate < 0 || years <= 0) {
      setError(sipError, "Please choose valid SIP values.");
      return;
    }
  
    setError(sipError, "");
  
    const months = years * 12;
    const monthlyRate = annualRate / 100 / 12;
    const invested = monthly * months;
  
    let futureValue;
    if (monthlyRate === 0) {
      futureValue = invested;
    } else {
      futureValue = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }
  
    const returns = futureValue - invested;
  
    animateNumber(sipInvested, invested);
    animateNumber(sipReturns, returns);
    animateNumber(sipFutureValue, futureValue);
  
    sipInsight.textContent =
      `A SIP of ₹${formatINR(monthly)} per month for ${years} years at ${annualRate}% annual return can grow into ₹${formatINR(futureValue)} through compounding.`;
  
    drawDoughnut(sipCtx, invested, Math.max(returns, 0), "#5aa7ff", "#7c6dff");
  }
  
  function calculateEMI() {
    const principal = Number(loanAmount.value);
    const annualRate = Number(loanRate.value);
    const years = Number(loanYears.value);
  
    if (!principal || principal <= 0 || annualRate < 0 || years <= 0) {
      setError(emiError, "Please choose valid loan values.");
      return;
    }
  
    setError(emiError, "");
  
    const months = years * 12;
    const monthlyRate = annualRate / 100 / 12;
  
    let emi;
    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
    }
  
    const totalPayment = emi * months;
    const interestPaid = totalPayment - principal;
  
    animateNumber(emiMonthly, emi);
    animateNumber(emiInterest, interestPaid);
    animateNumber(emiTotal, totalPayment);
  
    emiInsight.textContent =
      `For a loan of ₹${formatINR(principal)} at ${annualRate}% over ${years} years, your EMI is ₹${formatINR(emi)} per month.`;
  
    drawDoughnut(emiCtx, principal, Math.max(interestPaid, 0), "#3ddc97", "#5aa7ff");
  }
  
  function updateLabels() {
    sipAmountValue.textContent = `₹${formatINR(Number(sipAmount.value))}`;
    sipRateValue.textContent = `${Number(sipRate.value).toFixed(1)}%`;
    sipYearsValue.textContent = `${Number(sipYears.value)} Year${Number(sipYears.value) > 1 ? "s" : ""}`;
  
    loanAmountValue.textContent = `₹${formatINR(Number(loanAmount.value))}`;
    loanRateValue.textContent = `${Number(loanRate.value).toFixed(1)}%`;
    loanYearsValue.textContent = `${Number(loanYears.value)} Year${Number(loanYears.value) > 1 ? "s" : ""}`;
  }
  
  function updateAll() {
    updateLabels();
    calculateSIP();
    calculateEMI();
  }
  
  [sipAmount, sipRate, sipYears, loanAmount, loanRate, loanYears].forEach((el) => {
    el.addEventListener("input", updateAll);
  });
  
  window.addEventListener("resize", () => {
    calculateSIP();
    calculateEMI();
  });
  
  updateAll();