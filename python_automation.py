import pandas as pd
from datetime import datetime
import os

# Paths to the CSV files
BILLING_FILE = "./billing-dashboard/public/billing_records.csv"

def calculate_totals():
    if not os.path.exists(BILLING_FILE):
        raise FileNotFoundError(f"{BILLING_FILE} not found.")

    billing_df = pd.read_csv(BILLING_FILE)

    # Calculate amounts
    billing_df["taxAmount"] = (billing_df["amountUSD"] * (billing_df["taxRate"] / 100)).round(2)
    billing_df["discountAmount"] = (billing_df["amountUSD"] * (billing_df["discountPercent"] / 100)).round(2)
    billing_df["finalTotal"] = (billing_df["amountUSD"] + billing_df["taxAmount"] - billing_df["discountAmount"]).round(2)

    # Save back
    billing_df.to_csv(BILLING_FILE, index=False)
    print("Billing records updated with calculated totals.")

if __name__ == "__main__":
    calculate_totals()