import config from "./config";

export const fetchClients = async () => {
try {
const response = await fetch(`${config.baseURL}/api/clients`);
if (!response.ok) {
    throw new Error("Failed to fetch clients");
}
return await response.json();
} catch (error) {
console.error(error);
throw error;
}
};

export const fetchBillingRecords = async () => {
try {
const response = await fetch(`${config.baseURL}/api/data`);
if (!response.ok) {
    throw new Error("Failed to fetch billing records");
}
return await response.json();
} catch (error) {
console.error(error);
throw error;
}
};
