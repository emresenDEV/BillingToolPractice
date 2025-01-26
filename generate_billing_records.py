import pandas as pd
import os
import random
from faker import Faker

fake = Faker()

# Paths
BILLING_FILE = "./billing-dashboard/public/billing_records.csv"
CLIENTS_FILE = "./billing-dashboard/public/clients.csv"
TAX_RATES = {"CA": 7.5, "TX": 8.0, "NY": 8.875, "FL": 6.0, "IL": 8.25}

def generate_billing_records():
    if not os.path.exists(CLIENTS_FILE):
        raise FileNotFoundError(f"{CLIENTS_FILE} not found.")

    # Load clients
    clients_df = pd.read_csv(CLIENTS_FILE)

    # Generate billing records
    records = []
    for _, client in clients_df.iterrows():
        for _ in range(random.randint(1, 5)):  # Generate 1-5 invoices per client
            state = client["state"]
            tax_rate = TAX_RATES.get(state, 8.0)
            amount_usd = random.randint(100, 1000)
            discount_percent = random.choice([0, 5, 10, 15])
            tax_amount = round(amount_usd * (tax_rate / 100), 2)
            discount_amount = round(amount_usd * (discount_percent / 100), 2)
            final_total = round(amount_usd + tax_amount - discount_amount, 2)
            records.append({
                "invoiceID": random.randint(100000000, 999999999),  # 9-digit integer
                "clientID": client["clientID"],
                "businessName": client["businessName"],
                "service": random.choice(["Consulting", "Development", "Design"]),
                "amountUSD": amount_usd,
                "taxRate": tax_rate,
                "discountPercent": discount_percent,
                "status": random.choice(["Pending", "Paid", "Overdue"]),
                "dateUpdated": fake.date(),
                "timeUpdated": fake.time(),
                "taxAmount": tax_amount,
                "discountAmount": discount_amount,
                "finalTotal": final_total,
            })

    # Save records
    billing_df = pd.DataFrame(records)
    billing_df.to_csv(BILLING_FILE, index=False)
    print(f"billing_records.csv generated with {len(records)} records.")

if __name__ == "__main__":
    generate_billing_records()
