import {
  calculateSIP,
  calculateEMI,
  generateSIPChartData,
  formatINR,
} from "./utils/finance.js";

const sipAmountInput = document.getElementById("sip-amount");
const sipReturnInput = document.getElementById("sip-return");
const sipYearsInput = document.getElementById("sip-years");

const loanAmountInput = document.getElementById("loan-amount");
const loanInterestInput = document.getElementById("loan-interest");
const loanYearsInput = document.getElementById("loan-years");

const sipResult = document.getElementById("sip-result");
const emiResult = document.getElementById("emi-result");

const sipChartCanvas = document.getElementById("sipChart");
const emiChartCanvas = document.getElementById("emiChart");

let sipChart;
let emiChart;

function updateCalculations() {
  const sipAmount = Number(sipAmountInput.value);
  const sipReturn = Number(sipReturnInput.value);
  const sipYears = Number(sipYearsInput.value);

  const loanAmount = Number(loanAmountInput.value);
  const loanInterest = Number(loanInterestInput.value);
  const loanYears = Number(loanYearsInput.value);

  const sipData = calculateSIP(sipAmount, sipReturn, sipYears);

  sipResult.innerHTML = `
    <div class="result-card">
      <h3>Invested Amount</h3>
      <p>${formatINR(sipData.investedAmount)}</p>
    </div>

    <div class="result-card">
      <h3>Estimated Returns</h3>
      <p>${formatINR(sipData.estimatedReturns)}</p>
    </div>

    <div class="result-card highlight">
      <h3>Future Value</h3>
      <p>${formatINR(sipData.futureValue)}</p>
    </div>
  `;

  const emiData = calculateEMI(
    loanAmount,
    loanInterest,
    loanYears
  );

  emiResult.innerHTML = `
    <div class="result-card highlight">
      <h3>Monthly EMI</h3>
      <p>${formatINR(emiData.emi)}</p>
    </div>

    <div class="result-card">
      <h3>Total Interest</h3>
      <p>${formatINR(emiData.totalInterest)}</p>
    </div>

    <div class="result-card">
      <h3>Total Payment</h3>
      <p>${formatINR(emiData.totalPayment)}</p>
    </div>
  `;

  updateSipChart(
    generateSIPChartData(sipAmount, sipReturn, sipYears)
  );

  updateEmiChart(loanAmount, emiData.totalInterest);
}

function updateSipChart(data) {
  if (sipChart) {
    sipChart.destroy();
  }

  sipChart = new Chart(sipChartCanvas, {
    type: "line",
    data: {
      labels: data.map((item) => item.year),
      datasets: [
        {
          label: "Invested Amount",
          data: data.map((item) => item.invested),
          borderWidth: 3,
          tension: 0.35,
        },
        {
          label: "Total Value",
          data: data.map((item) => item.totalValue),
          borderWidth: 3,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ffffff",
          },
        },
        y: {
          ticks: {
            color: "#ffffff",
          },
        },
      },
    },
  });
}

function updateEmiChart(principal, interest) {
  if (emiChart) {
    emiChart.destroy();
  }

  emiChart = new Chart(emiChartCanvas, {
    type: "doughnut",
    data: {
      labels: ["Principal", "Interest"],
      datasets: [
        {
          data: [principal, interest],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
          },
        },
      },
    },
  });
}

[
  sipAmountInput,
  sipReturnInput,
  sipYearsInput,
  loanAmountInput,
  loanInterestInput,
  loanYearsInput,
].forEach((input) => {
  input.addEventListener("input", updateCalculations);
});

updateCalculations();
