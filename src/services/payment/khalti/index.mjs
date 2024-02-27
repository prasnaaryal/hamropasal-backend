import * as dotenv from "dotenv";
dotenv.config();

async function callKhaltiApi(paymentData) {
  try {
    const response = await fetch(
      `${process.env.KHALTI_API_TEST_URL}/epayment/initiate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling Khalti API:", error);
    throw error; // rethrow the error to handle it upstream
  }
}

export async function verifyPayment(pidx) {
  try {
    const response = await fetch(
      `${process.env.KHALTI_API_TEST_URL}/epayment/lookup/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
        body: JSON.stringify({
          pidx,
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling Khalti API:", error);
    throw error; // rethrow the error to handle it upstream
  }
}

export default callKhaltiApi;
