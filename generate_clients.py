import pandas as pd
import os
from faker import Faker
from datetime import datetime

# File paths
BILLING_FILE = "./billing-dashboard/public/billing_records.csv"
CLIENTS_FILE = "./billing-dashboard/public/clients.csv"

fake = Faker()

def generate_clients():
    if not os.path.exists(BILLING_FILE):
        raise FileNotFoundError(f"{BILLING_FILE} not found.")

    # Load billing records with error handling
    try:
        billing_records = pd.read_csv(BILLING_FILE)
    except pd.errors.EmptyDataError:
        raise ValueError(f"{BILLING_FILE} is empty or improperly formatted.")

    if billing_records.empty:
        raise ValueError(f"{BILLING_FILE} contains no data.")

    # Ensure the businessName column exists
    if "businessName" not in billing_records.columns:
        raise ValueError(f"'businessName' column not found in {BILLING_FILE}.")

    # Clean the businessName column and fill missing values with a placeholder
    billing_records["businessName"] = billing_records["businessName"].fillna("Unknown Business").astype(str)

    # Extract unique businesses
    unique_clients = billing_records[["businessName"]].drop_duplicates()

    # Add dummy clients to ensure there are 100 total clients
    while len(unique_clients) < 100:
        unique_clients = pd.concat(
            [
                unique_clients,
                pd.DataFrame({"businessName": [fake.company() for _ in range(100 - len(unique_clients))]})
            ],
            ignore_index=True,
        )

    # Assign client IDs
    unique_clients["clientID"] = range(1, len(unique_clients) + 1)
    unique_clients["contactName"] = [fake.name() for _ in range(len(unique_clients))]
    unique_clients["phoneNumber"] = [fake.phone_number() for _ in range(len(unique_clients))]

    # Generate email addresses
    def generate_email(name):
        try:
            return f"info@{name.replace(' ', '').lower()}.com"
        except AttributeError:
            return "info@unknown.com"

    unique_clients["email"] = unique_clients["businessName"].apply(generate_email)
    unique_clients["address"] = [fake.address() for _ in range(len(unique_clients))]
    unique_clients["state"] = [fake.state_abbr() for _ in range(len(unique_clients))]
    unique_clients["zipcode"] = [fake.zipcode() for _ in range(len(unique_clients))]
    unique_clients["notes"] = "Regular client"
    unique_clients["industry"] = [fake.bs() for _ in range(len(unique_clients))]
    unique_clients["createdDate"] = datetime.now().strftime("%Y-%m-%d")

    # Save to CSV
    unique_clients.to_csv(CLIENTS_FILE, index=False)
    print(f"clients.csv generated with {len(unique_clients)} clients.")

if __name__ == "__main__":
    try:
        generate_clients()
    except Exception as e:
        print(f"Error: {e}")
