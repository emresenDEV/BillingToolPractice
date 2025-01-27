from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import traceback
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Database configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'billing_dashboard.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

#Global Preflight Handlers
@app.after_request
def handle_options_request(response):
    """
    This function ensures proper CORS headers are included in every response
    and handles preflight OPTIONS requests.
    """
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@app.route("/api/<path:path>", methods=["OPTIONS"])
def handle_preflight(path):
    """
    Handles preflight OPTIONS requests for all /api/* endpoints.
    """
    response = jsonify({"message": "Preflight OPTIONS request handled"})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Seed Database
@app.route('/api/seed-database', methods=['POST'])
def seed_database():
    try:
        # Example seed data for clients and billing records
        clients = [
            {
                "clientID": 1,
                "businessName": "SampleCo",
                "contactName": "John Doe",
                "phoneNumber": "1234567890",
                "email": "johndoe@example.com",
                "address": "123 Main St",
                "state": "TX",
                "zipcode": "77001",
                "notes": "Preferred customer",
                "industry": "Tech",
                "createdDate": datetime.now().strftime("%Y-%m-%d"),
            }
        ]

        billing_records = [
            {
                "clientID": 1,
                "businessName": "SampleCo",
                "service": "Website Design",
                "amountUSD": 500,
                "taxRate": 8.25,
                "discountPercent": 5,
                "status": "Pending",
                "taxAmount": 41.25,
                "discountAmount": 25,
                "finalTotal": 516.25,
                "dateUpdated": datetime.now().strftime("%Y-%m-%d"),
                "timeUpdated": datetime.now().strftime("%H:%M:%S"),
                "notes": "Urgent delivery required",
            }
        ]

        for client in clients:
            db.session.add(Client(**client))

        for record in billing_records:
            db.session.add(BillingRecord(**record))

        db.session.commit()
        return jsonify({"message": "Database seeded successfully"}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error seeding database: {e}")
        return jsonify({"error": str(e)}), 500

#Serving Static Files
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists("billing-dashboard/build/" + path):
        return send_from_directory("billing-dashboard/build", path)
    else:
        return send_from_directory("billing-dashboard/build", "index.html")


# Database Models
class Client(db.Model):
    __tablename__ = 'clients'
    clientID = db.Column(db.Integer, primary_key=True)
    businessName = db.Column(db.String(100), nullable=False)
    contactName = db.Column(db.String(100), nullable=False)
    phoneNumber = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(2), nullable=False) 
    zipcode = db.Column(db.String(10), nullable=False)
    notes = db.Column(db.String(100), nullable=False)
    industry = db.Column(db.String(100), nullable=False)
    createdDate = db.Column(db.String(20), nullable=False)
    billing_records = db.relationship('BillingRecord', backref='client', lazy=True)

class BillingRecord(db.Model):
    __tablename__ = 'billing_records'
    invoiceID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    clientID = db.Column(db.Integer, db.ForeignKey('clients.clientID'), nullable=False)
    businessName = db.Column(db.String(100), nullable=False)
    service = db.Column(db.String(100), nullable=False)
    amountUSD = db.Column(db.Float, nullable=False)
    taxRate = db.Column(db.Float, nullable=False)
    discountPercent = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    dateUpdated = db.Column(db.String(20), nullable=False)
    timeUpdated = db.Column(db.String(20), nullable=False)
    taxAmount = db.Column(db.Float, nullable=False, default=0.0)
    discountAmount = db.Column(db.Float, nullable=False, default=0.0)
    finalTotal = db.Column(db.Float, nullable=False, default=0.0)
    notes = db.Column(db.String(255), nullable=True)

class TaxRate(db.Model):
    __tablename__ = 'tax_rates'
    state = db.Column(db.String(2), primary_key=True) 
    rate = db.Column(db.Float, nullable=False)      

# Initialize database tables
with app.app_context():
    db.create_all()

# API Endpoints

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        records = BillingRecord.query.all()
        data = [
            {
                "invoiceID": r.invoiceID,
                "clientID": r.clientID,
                "businessName": r.businessName,
                "service": r.service,
                "amountUSD": r.amountUSD,
                "taxRate": r.taxRate,
                "discountPercent": r.discountPercent,
                "status": r.status,
                "dateUpdated": r.dateUpdated,
                "timeUpdated": r.timeUpdated,
                "taxAmount": r.taxAmount,
                "discountAmount": r.discountAmount,
                "finalTotal": r.finalTotal,
            }
            for r in records
        ]
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error fetching data: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        clients = Client.query.all()
        data = [
            {
                "clientID": c.clientID,
                "businessName": c.businessName,
                "contactName": c.contactName,
                "phoneNumber": c.phoneNumber,
                "email": c.email,
                "state": c.state,
                "zipcode": c.zipcode,
            }
            for c in clients
        ]
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error fetching clients: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/api/create-client', methods=['POST'])
def create_client():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['clientID', 'businessName', 'contactName', 'phoneNumber', 'email', 'state']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Create a new client
        new_client = Client(
            clientID=data['clientID'],
            businessName=data['businessName'],
            contactName=data['contactName'],
            phoneNumber=data['phoneNumber'],
            email=data['email'],
            address=data.get('address', ''),  # Default empty string if missing
            state=data['state'],
            zipcode=data.get('zipcode', ''),  # Default empty string if missing
            notes=data.get('notes', ''),
            industry=data.get('industry', ''),
            createdDate=datetime.now().strftime("%Y-%m-%d"),
        )

        db.session.add(new_client)
        db.session.commit()

        return jsonify({
            "message": "Client created successfully",
            "clientID": new_client.clientID
        }), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating client: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500



@app.route('/api/create-invoice', methods=['POST'])
def create_invoice():
    try:
        data = request.get_json()
        app.logger.info(f"Received payload: {data}")

        # Validate numeric fields
        if 'amountUSD' not in data or not isinstance(data['amountUSD'], (int, float)):
            app.logger.error("Invalid 'amountUSD' value.")
            return jsonify({"error": "'amountUSD' is required and must be a number"}), 400
        try:
            amount_usd = float(data['amountUSD'])
            tax_rate = float(data['taxRate'])
            discount_percent = float(data['discountPercent'])
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid numeric value for amountUSD, taxRate, or discountPercent"}), 400

        # Fetch the client
        client = db.session.get(Client, data['clientID'])
        if not client:
            return jsonify({"error": "Client not found"}), 404

        # Calculate tax, discount, and final total
        tax_amount = (amount_usd * tax_rate) / 100
        discount_amount = (amount_usd * discount_percent) / 100
        final_total = amount_usd + tax_amount - discount_amount

        # Create new invoice record
        new_invoice = BillingRecord(
            clientID=data['clientID'],
            businessName=client.businessName,
            service=data['service'],
            amountUSD=amount_usd,
            taxRate=tax_rate,
            discountPercent=discount_percent,
            status=data.get('status', 'Pending'),
            dateUpdated=datetime.now().strftime("%Y-%m-%d"),
            timeUpdated=datetime.now().strftime("%H:%M:%S"),
            taxAmount=tax_amount,
            discountAmount=discount_amount,
            finalTotal=final_total,
            notes=data.get('notes')  # Optional field
        )
        db.session.add(new_invoice)
        db.session.commit()

        return jsonify({"message": "Invoice created successfully", "invoice": new_invoice.invoiceID}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating invoice: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500



@app.route('/api/update-invoice', methods=['PUT'])
def update_invoice():
    try:
        data = request.get_json()

        # Retrieve the invoice by ID
        invoice = BillingRecord.query.get(data.get('invoiceID'))
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404

        # Validate required fields and set defaults if missing
        required_fields = [
            'service', 'amountUSD', 'taxRate', 'discountPercent',
            'status', 'taxAmount', 'discountAmount', 'finalTotal'
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Update invoice fields
        invoice.service = data.get('service', invoice.service)
        invoice.amountUSD = float(data.get('amountUSD', invoice.amountUSD))
        invoice.taxRate = float(data.get('taxRate', invoice.taxRate))
        invoice.discountPercent = float(data.get('discountPercent', invoice.discountPercent))
        invoice.status = data.get('status', invoice.status)
        invoice.taxAmount = float(data.get('taxAmount', invoice.taxAmount))
        invoice.discountAmount = float(data.get('discountAmount', invoice.discountAmount))
        invoice.finalTotal = float(data.get('finalTotal', invoice.finalTotal))
        invoice.notes = data.get('notes', invoice.notes)
        invoice.dateUpdated = datetime.now().strftime("%Y-%m-%d")
        invoice.timeUpdated = datetime.now().strftime("%H:%M:%S")

        # Commit changes to the database
        db.session.commit()

        return jsonify({
            "message": "Invoice updated successfully",
            "invoiceID": invoice.invoiceID
        }), 200
    except ValueError as ve:
        app.logger.error(f"Invalid numeric value: {ve}")
        return jsonify({"error": "Invalid numeric value provided"}), 400
    except Exception as e:
        # Roll back session on error and log the exception
        db.session.rollback()
        app.logger.error(f"Error updating invoice: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500



@app.route('/api/tax-rates', methods=['GET'])
def get_tax_rates():
    try:
        state = request.args.get('state')  # Check for a specific state query
        app.logger.info(f"Fetching tax rate for state: {state}")
        
        if state:
            tax_rate = TaxRate.query.filter_by(state=state.upper()).first()
            app.logger.info(f"Tax rate found: {tax_rate}")
            
            if tax_rate:
                return jsonify({"state": tax_rate.state, "rate": tax_rate.rate})
            else:
                app.logger.warning(f"No tax rate found for state {state}. Using default rate.")
                return jsonify({"state": state, "rate": 8.0})  # Default tax rate
        else:
            # Return all tax rates if no specific state is queried
            rates = TaxRate.query.all()
            data = [{"state": r.state, "rate": r.rate} for r in rates]
            return jsonify(data)
    except Exception as e:
        app.logger.error(f"Error fetching tax rates: {e}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
