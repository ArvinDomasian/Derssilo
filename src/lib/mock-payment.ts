type MockPaymentInput = {
  amount: string;
  currency?: string;
};

type MockPaymentResult = {
  success: boolean;
  transactionId: string;
  status: "authorized" | "captured";
};

export async function chargeMockCard(input: MockPaymentInput): Promise<MockPaymentResult> {
  // Simulates external latency to mimic a payment API.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      success: false,
      transactionId: "",
      status: "authorized"
    };
  }

  return {
    success: true,
    transactionId: `mock_txn_${Date.now()}`,
    status: "captured"
  };
}
