const config = {
baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
endpoints: {
    clients: "/clients",
    billingRecords: "/data",
    taxRates: "/tax-rates",
    createInvoice: "/create-invoice",
    updateClient: "/update-client",
    taxRate: "/tax-rate",
    createClient: "/create-client",
    
},
};

export default config;
