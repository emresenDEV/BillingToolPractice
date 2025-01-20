from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os
import traceback

app = Flask(__name__)
CORS(app)

# Absolute path to the CSV file
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), "billing-dashboard", "public", "billing_records.csv")

# Path to the clients.csv file
CLIENTS_FILE = "./billing-dashboard/public/clients.csv"

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        # Check if the file exists
        if not os.path.exists(CSV_FILE_PATH):
            raise FileNotFoundError(f"CSV file not found at {CSV_FILE_PATH}")

        # Read the CSV file
        records = pd.read_csv(CSV_FILE_PATH)

        # Validate required columns
        REQUIRED_COLUMNS = [
            "invoiceID", "businessName", "dateUpdated", "timeUpdated",
            "service", "amountUSD", "taxRate", "discountPercent", "status",
            "taxAmount", "discountAmount", "finalTotal"
        ]
        if not all(col in records.columns for col in REQUIRED_COLUMNS):
            raise ValueError(f"Missing one or more required columns: {REQUIRED_COLUMNS}")

        # Convert to a list of dictionaries
        data = records.to_dict(orient="records")
        return jsonify(data)

    except Exception as e:
        app.logger.error(f"Error processing CSV file: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        # Check if the file exists
        if not os.path.exists(CLIENTS_FILE):
            raise FileNotFoundError(f"{CLIENTS_FILE} not found.")
        
        # Load the CSV file into a DataFrame
        clients_df = pd.read_csv(CLIENTS_FILE)
        
        # Convert DataFrame to a list of dictionaries
        clients_data = clients_df.to_dict(orient="records")
        return jsonify(clients_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
