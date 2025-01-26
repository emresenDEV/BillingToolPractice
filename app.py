from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import traceback
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'billing_dashboard.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

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

@app.route('/api/create-invoice', methods=['POST'])
def create_invoice():
    try:
        data = request.get_json()
        client = Client.query.get(data['clientID'])
        if not client:
            return jsonify({"error": "Client not found"}), 404

        #Calculate tax rate
        tax_rate = TaxRate.query.filter_by(state=client.state).first()
        if not tax_rate:
            return jsonify({"error": "Tax rate not found for client state"}), 404
        
        # Calculate tax, discount, and final total
        tax_amount = (data['amountUSD'] * data['taxRate']) / 100
        discount_amount = (data['amountUSD'] * data['discountPercent']) / 100
        final_total = data['amountUSD'] + tax_amount - discount_amount

        # Create new invoice record
        new_invoice = BillingRecord(
            clientID=data['clientID'],
            businessName=client.businessName,
            service=data['service'],
            amountUSD=data['amountUSD'],
            taxRate=tax_rate.rate,
            discountPercent=data['discountPercent'],
            status=data.get('status', 'Pending'),
            dateUpdated=datetime.now().strftime("%Y-%m-%d"),
            timeUpdated=datetime.now().strftime("%H:%M:%S"),
            taxAmount=(data['amountUSD'] * tax_rate.rate) / 100,
            discountAmount=(data['amountUSD'] * data['discountPercent']) / 100,
            finalTotal=data['amountUSD'] + ((data['amountUSD'] * tax_rate.rate) / 100)
                        - ((data['amountUSD'] * data['discountPercent']) / 100),
            notes=data.get('notes')  # Optional field
        )
        db.session.add(new_invoice)
        db.session.commit()

        return jsonify({"message": "Invoice created successfully", "invoice": new_invoice.invoiceID}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating invoice: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tax-rates', methods=['GET'])
def get_tax_rates():
    try:
        state = request.args.get('state')  # Check for a specific state query
        if state:
            tax_rate = TaxRate.query.filter_by(state=state.upper()).first()
            if tax_rate:
                return jsonify({"state": tax_rate.state, "rate": tax_rate.rate})
            else:
                return jsonify({"error": f"No tax rate found for state {state}"}), 404
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
