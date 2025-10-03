from flask import Blueprint, request, jsonify
from models import db, Customer, Service, Appointment, Billing
from datetime import datetime

api = Blueprint('api', __name__)

# Customer routes
@api.route('/customers', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        customer = Customer(
            name=data['name'],
            phone=data['phone'],
            email=data.get('email', '')
        )
        db.session.add(customer)
        db.session.commit()
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify([customer.to_dict() for customer in customers])

# Service routes
@api.route('/services', methods=['POST'])
def create_service():
    try:
        data = request.get_json()
        service = Service(
            name=data['name'],
            price=data['price']
        )
        db.session.add(service)
        db.session.commit()
        return jsonify(service.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([service.to_dict() for service in services])

# Appointment routes
@api.route('/appointments', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        
        # Check if customer exists, if not create one
        customer = Customer.query.filter_by(phone=data['phone']).first()
        if not customer:
            customer = Customer(
                name=data['name'],
                phone=data['phone'],
                email=data.get('email', '')
            )
            db.session.add(customer)
            db.session.commit()
        
        appointment = Appointment(
            customer_id=customer.id,
            service_id=data['service_id'],
            date=data['date'],
            time=data['time'],
            status='Pending'
        )
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify(appointment.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([appointment.to_dict() for appointment in appointments])

@api.route('/appointments/<int:id>', methods=['PUT'])
def update_appointment(id):
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        
        if 'status' in data:
            appointment.status = data['status']
        
        if 'date' in data:
            appointment.date = data['date']
        
        if 'time' in data:
            appointment.time = data['time']
        
        db.session.commit()
        
        # If status changed to Completed, create billing automatically
        if appointment.status == 'Completed' and not appointment.billing:
            billing = Billing(
                appointment_id=appointment.id,
                amount=appointment.service.price,
                payment_status='Unpaid',
                issued_date=datetime.now().strftime('%Y-%m-%d')
            )
            db.session.add(billing)
            db.session.commit()
        
        return jsonify(appointment.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Billing routes
@api.route('/billing', methods=['POST'])
def create_billing():
    try:
        data = request.get_json()
        billing = Billing(
            appointment_id=data['appointment_id'],
            amount=data['amount'],
            payment_status=data.get('payment_status', 'Unpaid'),
            issued_date=data.get('issued_date', datetime.now().strftime('%Y-%m-%d'))
        )
        db.session.add(billing)
        db.session.commit()
        return jsonify(billing.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route('/billing', methods=['GET'])
def get_billing():
    billing_records = Billing.query.all()
    return jsonify([bill.to_dict() for bill in billing_records])

@api.route('/billing/<int:id>/pay', methods=['PUT'])
def mark_paid(id):
    try:
        billing = Billing.query.get_or_404(id)
        billing.payment_status = 'Paid'
        db.session.commit()
        return jsonify(billing.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 400