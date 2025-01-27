import pandas as pd
from app import app, db, Client, BillingRecord, TaxRate

# Load data from CSV files
clients_df = pd.read_csv("./billing-dashboard/public/clients.csv")
billing_records_df = pd.read_csv("./billing-dashboard/public/billing_records.csv")
tax_rates_df = pd.read_csv("./billing-dashboard/public/data/tax_rates.csv")

# Insert data into the database
with app.app_context():
    try:
    # Insert Clients
        for _, row in clients_df.iterrows():
            client = Client(
                businessName=row["businessName"],
                clientID=row["clientID"],
                contactName=row["contactName"],
                phoneNumber=row["phoneNumber"],
                email=row["email"],
                address=row["address"],
                state=row["state"],
                zipcode=row["zipcode"],
                notes=row["notes"],
                industry=row["industry"],
                createdDate=row["createdDate"],
            )
            db.session.add(client)

        # Billing Records
        for _, row in billing_records_df.iterrows():
            record = BillingRecord(
                invoiceID=row["invoiceID"],
                clientID=row["clientID"],
                businessName=row["businessName"],
                service=row["service"],
                amountUSD=row["amountUSD"],
                taxRate=row["taxRate"],
                discountPercent=row["discountPercent"],
                status=row["status"],
                dateUpdated=row["dateUpdated"],
                timeUpdated=row["timeUpdated"],
                taxAmount=row["taxAmount"],
                discountAmount=row["discountAmount"],
                finalTotal=row["finalTotal"],
            )
            db.session.add(record)

        # Tax Rates
        for _, row in tax_rates_df.iterrows():
            tax_rate = TaxRate(
                state=row["state"],
                rate=row["rate"],
            )
            db.session.add(tax_rate)
        
        db.session.commit()
        print("Data migration completed successfully!")
    
    except Exception as e:
        db.session.rollback()
        print(f"Error migrating data: {e}")

