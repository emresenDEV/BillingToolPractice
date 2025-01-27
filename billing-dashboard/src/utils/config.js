const config = {
baseURL: "http://3.135.9.162:5000/api", // production API (EC2 instance)
endpoints: {
    clients: "/api/clients",
    billingRecords: "/api/data",
    taxRates: "/api/tax-rates",
},
};

export default config;
