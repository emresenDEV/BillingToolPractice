import pandas as pd
import os

# Paths to files
BILLING_FILE = "./public/billing_records.csv"
CLIENTS_FILE = "./public/clients.csv"

def update_billing_with_client_id():
    if not os.path.exists(BILLING_FILE) or not os.path.exists(CLIENTS_FILE):
        raise FileNotFoundError("Billing or Clients file not found.")

    # Read the files
    billing_records = pd.read_csv(BILLING_FILE)
    clients = pd.read_csv(CLIENTS_FILE)

    # Merge data to add clientID to billing_records
    updated_billing = billing_records.merge(
        clients[["clientID", "businessName", "address", "state", "zipcode", "phoneNumber"]],
        on=["businessName", "address", "state", "zipcode", "phoneNumber"],
        how="left"
    )

    # Validate clientID existence
    if updated_billing["clientID"].isnull().any():
        raise ValueError("Some records in billing_records could not be matched with a client.")

    # Save the updated billing records
    updated_billing.to_csv(BILLING_FILE, index=False)
    print(f"billing_records.csv updated with clientID.")

# Run the script
if __name__ == "__main__":
    update_billing_with_client_id()
