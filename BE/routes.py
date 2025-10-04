from flask import Blueprint, request, jsonify
from models import db, Customer, Service, Appointment, Billing
from datetime import datetime

api = Blueprint('api', __name__)

# Customer routes
@api.route('/customers', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'phone' not in data:
            return jsonify({'error': 'Name and phone are required'}), 400
        
        # Check if customer already exists with same phone
        existing_customer = Customer.query.filter_by(phone=data['phone']).first()
        if existing_customer:
            return jsonify({
                'message': 'Customer already exists',
                'customer': existing_customer.to_dict()
            }), 200
        
        customer = Customer(
            name=data['name'],
            phone=data['phone'],
            email=data.get('email', '')
        )
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({
            'message': 'Customer created successfully',
            'customer': customer.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create customer: {str(e)}'}), 500

@api.route('/customers', methods=['GET'])
def get_customers():
    try:
        customers = Customer.query.all()
        return jsonify({
            'count': len(customers),
            'customers': [customer.to_dict() for customer in customers]
        })
    except Exception as e:
        return jsonify({'error': f'Failed to fetch customers: {str(e)}'}), 500

# Service routes
@api.route('/services', methods=['POST'])
def create_service():
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'price' not in data:
            return jsonify({'error': 'Name and price are required'}), 400
        
        service = Service(
            name=data['name'],
            price=float(data['price'])
        )
        db.session.add(service)
        db.session.commit()
        
        return jsonify({
            'message': 'Service created successfully',
            'service': service.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create service: {str(e)}'}), 500

@api.route('/services', methods=['GET'])
def get_services():
    try:
        services = Service.query.all()
        return jsonify({
            'count': len(services),
            'services': [service.to_dict() for service in services]
        })
    except Exception as e:
        return jsonify({'error': f'Failed to fetch services: {str(e)}'}), 500

# Appointment routes
@api.route('/appointments', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'phone', 'service_id', 'date', 'time']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Find or create customer
        customer = Customer.query.filter_by(phone=data['phone']).first()
        if not customer:
            customer = Customer(
                name=data['name'],
                phone=data['phone'],
                email=data.get('email', '')
            )
            db.session.add(customer)
            db.session.flush()  # Get the ID without committing
        
        # Verify service exists
        service = Service.query.get(data['service_id'])
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        # Create appointment
        appointment = Appointment(
            customer_id=customer.id,
            service_id=service.id,
            date=data['date'],
            time=data['time'],
            status='Pending',
            created_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        )
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment booked successfully',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create appointment: {str(e)}'}), 500

@api.route('/appointments', methods=['GET'])
def get_appointments():
    try:
        appointments = Appointment.query.all()
        return jsonify({
            'count': len(appointments),
            'appointments': [appointment.to_dict() for appointment in appointments]
        })
    except Exception as e:
        return jsonify({'error': f'Failed to fetch appointments: {str(e)}'}), 500

@api.route('/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        data = request.get_json()
        
        # Update status if provided
        if 'status' in data:
            valid_statuses = ['Pending', 'Approved', 'Completed', 'Cancelled']
            if data['status'] in valid_statuses:
                appointment.status = data['status']
                
                # Auto-create billing when appointment is completed
                if data['status'] == 'Completed' and not appointment.billing:
                    billing = Billing(
                        appointment_id=appointment.id,
                        amount=appointment.service.price,
                        payment_status='Unpaid',
                        issued_date=datetime.now().strftime('%Y-%m-%d')
                    )
                    db.session.add(billing)
        
        # Update date/time if provided
        if 'date' in data:
            appointment.date = data['date']
        if 'time' in data:
            appointment.time = data['time']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment updated successfully',
            'appointment': appointment.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update appointment: {str(e)}'}), 500

# Billing routes
@api.route('/billing', methods=['POST'])
def create_billing():
    try:
        data = request.get_json()
        
        if not data or 'appointment_id' not in data or 'amount' not in data:
            return jsonify({'error': 'Appointment ID and amount are required'}), 400
        
        # Check if billing already exists for this appointment
        existing_billing = Billing.query.filter_by(appointment_id=data['appointment_id']).first()
        if existing_billing:
            return jsonify({
                'message': 'Billing already exists for this appointment',
                'billing': existing_billing.to_dict()
            }), 200
        
        billing = Billing(
            appointment_id=data['appointment_id'],
            amount=float(data['amount']),
            payment_status=data.get('payment_status', 'Unpaid'),
            issued_date=data.get('issued_date', datetime.now().strftime('%Y-%m-%d'))
        )
        db.session.add(billing)
        db.session.commit()
        
        return jsonify({
            'message': 'Billing created successfully',
            'billing': billing.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create billing: {str(e)}'}), 500

@api.route('/billing', methods=['GET'])
def get_billing():
    try:
        billing_records = Billing.query.all()
        return jsonify({
            'count': len(billing_records),
            'billing': [bill.to_dict() for bill in billing_records]
        })
    except Exception as e:
        return jsonify({'error': f'Failed to fetch billing records: {str(e)}'}), 500

@api.route('/billing/<int:billing_id>/pay', methods=['PUT'])
def mark_paid(billing_id):
    try:
        billing = Billing.query.get_or_404(billing_id)
        billing.payment_status = 'Paid'
        billing.paid_date = datetime.now().strftime('%Y-%m-%d')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Payment marked as paid successfully',
            'billing': billing.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update payment status: {str(e)}'}), 500