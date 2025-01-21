from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import traceback

app = Flask(__name__)
CORS(app)

# Paths to CSV files
BILLING_FILE = os.path.join(os.path.dirname(__file__), "data", "billing_records.csv")
CLIENTS_FILE = os.path.join(os.path.dirname(__file__), "data", "clients.csv")
USER_FILE = os.path.join(os.path.dirname(__file__), "data", "users.csv")

# Required columns for billing records
REQUIRED_COLUMNS = [
    "invoiceID", "businessName", "dateUpdated", "timeUpdated",
    "service", "amountUSD", "taxRate", "discountPercent", "status",
    "taxAmount", "discountAmount", "finalTotal"
]

# Routes

@app.route('/api/login', methods=['POST'])
def login():
    """Validate user credentials."""
    try:
        # Load user data
        if not os.path.exists(USER_FILE):
            raise FileNotFoundError(f"File not found: {USER_FILE}")
        
        users_df = pd.read_csv(USER_FILE)

        # Get credentials from request
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Validate credentials
        user = users_df[(users_df["username"] == username) & (users_df["password"] == password)]
        if user.empty:
            return jsonify({"error": "Invalid username or password"}), 401

        return jsonify({"message": "Login successful!"}), 200

    except Exception as e:
        app.logger.error(f"Login error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    """Send password to user's email."""
    try:
        if not os.path.exists(USER_FILE):
            raise FileNotFoundError(f"File not found: {USER_FILE}")

        users_df = pd.read_csv(USER_FILE)
        data = request.json
        username = data.get("username")

        if not username:
            return jsonify({"error": "Username is required"}), 400

        # Find user
        user = users_df[users_df["username"] == username]
        if user.empty:
            return jsonify({"error": "Username not found"}), 404

        user_email = user.iloc[0]["email"]
        user_password = user.iloc[0]["password"]

        # Simulate sending email
        print(f"Email sent to {user_email} with password: {user_password}")
        return jsonify({"message": "Password emailed to your address."}), 200

    except Exception as e:
        app.logger.error(f"Forgot password error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['GET'])
def get_data():
    """Fetch all billing records."""
    try:
        # Check if file exists
        if not os.path.exists(BILLING_FILE):
            raise FileNotFoundError(f"File not found at {BILLING_FILE}")

        # Read the CSV file
        records = pd.read_csv(BILLING_FILE)

        # Validate required columns
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in records.columns]
        if missing_columns:
            raise ValueError(f"Missing columns: {', '.join(missing_columns)}")

        # Convert records to JSON
        data = records.to_dict(orient="records")
        return jsonify(data)

    except Exception as e:
        app.logger.error(f"Error processing billing records: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route('/api/clients', methods=['GET'])
def get_clients():
    """Fetch all client records."""
    try:
        # Check if file exists
        if not os.path.exists(CLIENTS_FILE):
            raise FileNotFoundError(f"File not found at {CLIENTS_FILE}")

        # Read the clients CSV file
        clients = pd.read_csv(CLIENTS_FILE)

        # Convert to JSON
        data = clients.to_dict(orient="records")
        return jsonify(data)

    except Exception as e:
        app.logger.error(f"Error processing clients file: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route('/api/data', methods=['POST'])
def update_billing_records():
    """Update billing records."""
    try:
        # Get JSON payload from request
        data = request.json
        if not data or not isinstance(data, list):
            raise ValueError("Invalid input data. Expected a list of records.")

        # Validate data contains required columns
        sample_record = data[0]
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in sample_record]
        if missing_columns:
            raise ValueError(f"Missing columns in input: {', '.join(missing_columns)}")

        # Write new data to the CSV
        new_df = pd.DataFrame(data)
        new_df.to_csv(BILLING_FILE, index=False)
        return jsonify({"message": "Billing records updated successfully!"})

    except Exception as e:
        app.logger.error(f"Error updating billing records: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route('/api/clients', methods=['POST'])
def update_clients():
    """Update client records."""
    try:
        # Get JSON payload from request
        data = request.json
        if not data or not isinstance(data, list):
            raise ValueError("Invalid input data. Expected a list of records.")

        # Write new data to the CSV
        new_df = pd.DataFrame(data)
        new_df.to_csv(CLIENTS_FILE, index=False)
        return jsonify({"message": "Client records updated successfully!"})

    except Exception as e:
        app.logger.error(f"Error updating client records: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
