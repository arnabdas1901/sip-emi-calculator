export function formatINR(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  }
  
  export function calculateSIP(monthlyInvestment, annualReturnRate, years) {
    const months = years * 12;
    const monthlyRate = annualReturnRate / 12 / 100;
  
    const futureValue =
      monthlyInvestment *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate));
  
    const investedAmount = monthlyInvestment * months;
    const estimatedReturns = futureValue - investedAmount;
  
    return {
      investedAmount,
      estimatedReturns,
      futureValue,
    };
  }
  
  export function generateSIPChartData(
    monthlyInvestment,
    annualReturnRate,
    years
  ) {
    const data = [];
    const monthlyRate = annualReturnRate / 12 / 100;
  
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
  
      const invested = monthlyInvestment * months;
  
      const totalValue =
        monthlyInvestment *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate));
  
      data.push({
        year: `Year ${year}`,
        invested: Math.round(invested),
        totalValue: Math.round(totalValue),
      });
    }
  
    return data;
  }
  
  export function calculateEMI(principal, annualInterestRate, years) {
    const monthlyRate = annualInterestRate / 12 / 100;
    const months = years * 12;
  
    const emi =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
  
    return {
      emi,
      totalPayment,
      totalInterest,
    };
  }