from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import pandas as pd
import os
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com"]}})

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

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    """Validate user credentials."""
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        if not os.path.exists(USER_FILE):
            raise FileNotFoundError(f"File not found: {USER_FILE}")
        
        users_df = pd.read_csv(USER_FILE)

        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        user = users_df[(users_df["username"] == username) & (users_df["password"] == password)]
        if user.empty:
            return jsonify({"error": "Invalid username or password"}), 401

        return _build_actual_response({"message": "Login successful!"})

    except Exception as e:
        app.logger.error(f"Login error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/forgot-password', methods=['POST', 'OPTIONS'])
def forgot_password():
    """Send password to user's email."""
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    try:
        if not os.path.exists(USER_FILE):
            raise FileNotFoundError(f"File not found: {USER_FILE}")

        users_df = pd.read_csv(USER_FILE)
        data = request.json
        username = data.get("username")

        if not username:
            return jsonify({"error": "Username is required"}), 400

        user = users_df[users_df["username"] == username]
        if user.empty:
            return jsonify({"error": "Username not found"}), 404

        user_email = user.iloc[0]["email"]
        user_password = user.iloc[0]["password"]

        print(f"Email sent to {user_email} with password: {user_password}")
        return _build_actual_response({"message": "Password emailed to your address."})

    except Exception as e:
        app.logger.error(f"Forgot password error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/data', methods=['GET', 'OPTIONS'])
def get_data():
    """Fetch all billing records."""
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    try:
        if not os.path.exists(BILLING_FILE):
            raise FileNotFoundError(f"File not found at {BILLING_FILE}")

        records = pd.read_csv(BILLING_FILE)

        missing_columns = [col for col in REQUIRED_COLUMNS if col not in records.columns]
        if missing_columns:
            raise ValueError(f"Missing columns: {', '.join(missing_columns)}")

        data = records.to_dict(orient="records")
        return _build_actual_response(data)

    except Exception as e:
        app.logger.error(f"Error processing billing records: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route('/api/clients', methods=['GET', 'POST', 'OPTIONS'])
def clients():
    """Fetch or update client records."""
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    try:
        if request.method == 'GET':
            if not os.path.exists(CLIENTS_FILE):
                raise FileNotFoundError(f"File not found at {CLIENTS_FILE}")

            clients = pd.read_csv(CLIENTS_FILE)
            data = clients.to_dict(orient="records")
            return _build_actual_response(data)

        elif request.method == 'POST':
            data = request.json
            if not data or not isinstance(data, list):
                raise ValueError("Invalid input data. Expected a list of records.")

            new_df = pd.DataFrame(data)
            new_df.to_csv(CLIENTS_FILE, index=False)
            return _build_actual_response({"message": "Client records updated successfully!"})

    except Exception as e:
        app.logger.error(f"Error processing clients: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/data', methods=['POST', 'OPTIONS'])
def update_billing_records():
    """Update billing records."""
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    try:
        data = request.json
        if not data or not isinstance(data, list):
            raise ValueError("Invalid input data. Expected a list of records.")

        sample_record = data[0]
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in sample_record]
        if missing_columns:
            raise ValueError(f"Missing columns in input: {', '.join(missing_columns)}")

        new_df = pd.DataFrame(data)
        new_df.to_csv(BILLING_FILE, index=False)
        return _build_actual_response({"message": "Billing records updated successfully!"})

    except Exception as e:
        app.logger.error(f"Error updating billing records: {e}")
        return jsonify({"error": str(e)}), 500


def _build_cors_preflight_response():
    """Build a response for CORS preflight requests."""
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


def _build_actual_response(body):
    """Build a response with CORS headers."""
    response = jsonify(body)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


if __name__ == '__main__':
    app.run(debug=True, port=5001)
