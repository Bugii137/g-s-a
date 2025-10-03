from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))
    
    appointments = db.relationship('Appointment', backref='customer', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email
        }

class Service(db.Model):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    appointments = db.relationship('Appointment', backref='service', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price
        }

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    time = db.Column(db.String(8), nullable=False)   # HH:MM AM/PM
    status = db.Column(db.String(20), default='Pending')  # Pending, Approved, Completed, Cancelled
    
    billing = db.relationship('Billing', backref='appointment', uselist=False, lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'service_id': self.service_id,
            'date': self.date,
            'time': self.time,
            'status': self.status,
            'customer': self.customer.to_dict() if self.customer else None,
            'service': self.service.to_dict() if self.service else None
        }

class Billing(db.Model):
    __tablename__ = 'billing'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(20), default='Unpaid')  # Paid, Unpaid
    issued_date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    
    def to_dict(self):
        return {
            'id': self.id,
            'appointment_id': self.appointment_id,
            'amount': self.amount,
            'payment_status': self.payment_status,
            'issued_date': self.issued_date,
            'appointment': self.appointment.to_dict() if self.appointment else None
        }