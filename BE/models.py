from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(100))
    
    # Relationships
    appointments = db.relationship('Appointment', back_populates='customer', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email
        }
    
    def __repr__(self):
        return f'<Customer {self.name} ({self.phone})>'

class Service(db.Model):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    price = db.Column(db.Float, nullable=False)
    
    # Relationships
    appointments = db.relationship('Appointment', back_populates='service', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price
        }
    
    def __repr__(self):
        return f'<Service {self.name} - KES {self.price}>'

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    time = db.Column(db.String(8), nullable=False)   # HH:MM AM/PM
    status = db.Column(db.String(20), default='Pending')  # Pending, Approved, Completed, Cancelled
    created_at = db.Column(db.String(20), default='2024-01-04 10:00:00')
    
    # Relationships
    customer = db.relationship('Customer', back_populates='appointments')
    service = db.relationship('Service', back_populates='appointments')
    billing = db.relationship('Billing', back_populates='appointment', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'service_id': self.service_id,
            'date': self.date,
            'time': self.time,
            'status': self.status,
            'created_at': self.created_at,
            'customer': self.customer.to_dict() if self.customer else None,
            'service': self.service.to_dict() if self.service else None,
            'billing': self.billing.to_dict() if self.billing else None
        }
    
    def __repr__(self):
        return f'<Appointment {self.id} - {self.status}>'

class Billing(db.Model):
    __tablename__ = 'billing'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False, unique=True)
    amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), default='Unpaid')  # Paid, Unpaid
    issued_date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    paid_date = db.Column(db.String(10))
    
    # Relationships
    appointment = db.relationship('Appointment', back_populates='billing')
    
    def to_dict(self):
        return {
            'id': self.id,
            'appointment_id': self.appointment_id,
            'amount': self.amount,
            'payment_status': self.payment_status,
            'issued_date': self.issued_date,
            'paid_date': self.paid_date,
            'appointment': self.appointment.to_dict() if self.appointment else None
        }
    
    def __repr__(self):
        return f'<Billing {self.id} - {self.payment_status} - KES {self.amount}>'