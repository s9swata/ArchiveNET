import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function test(token: string) {
  const response = await axios.get(`${API_BASE_URL}/test`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getUserSubscription(token: string) {
  const response = await axios.get(`${API_BASE_URL}/user_subscriptions/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deployArweaveContract(token: string){
  const response = await axios.post(`${API_BASE_URL}/deploy/contract`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
}

export async function hitPaymentWebhook(token: string, txHash: string, subscriptionPlan: string, quotaLimit: number ) {
  await axios.post(`${API_BASE_URL}/webhook/payments/web3`,{
      txHash,
      subscriptionPlan,
      quotaLimit
    }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
}

export async function createNewApiKey (token: string){
  const response = await axios.post(`${API_BASE_URL}/instances/create`, {}
  , {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  console.log(response.data);
  return response.data;
}

export async function getInstances(token: string) {
  const response = await axios.get(`${API_BASE_URL}/instances/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data;
}