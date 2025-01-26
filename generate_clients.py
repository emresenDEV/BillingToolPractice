import pandas as pd
import os
import random
from faker import Faker
from datetime import datetime

# File paths
CLIENTS_FILE = "./billing-dashboard/public/clients.csv"

fake = Faker()

def generate_clients():
    # Generate clients
    clients = []
    for _ in range(100):  # Generate 100 unique clients
        business_name = fake.company()
        contact_name = fake.name()
        phone_number = f"1+{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
        client_id = random.randint(100000000, 999999999)  # 9-digit integer
        email = f"info@{business_name.replace(' ', '').lower()}.com"
        notes = random.choice([
            "Client contacted us for an estimate.",
            "Client requested more time to pay.",
            "VIP client with frequent orders.",
            "Long-term client with consistent payments.",
            "Recently onboarded client, requires follow-up."
        ])
        clients.append({
            "clientID": client_id,
            "businessName": business_name,
            "contactName": contact_name,
            "phoneNumber": phone_number,
            "email": email,
            "address": fake.street_address(),
            "state": fake.state_abbr(),
            "zipcode": fake.zipcode(),
            "notes": notes,
            "industry": fake.bs(),
            "createdDate": datetime.now().strftime("%Y-%m-%d")
        })

    # Save to CSV
    clients_df = pd.DataFrame(clients)
    clients_df.to_csv(CLIENTS_FILE, index=False)
    print(f"clients.csv generated with {len(clients)} clients.")

if __name__ == "__main__":
    generate_clients()
