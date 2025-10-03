from flask import Flask
from models import db
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app

def seed_data():
    app = create_app()
    
    with app.app_context():
        from models import Customer, Service, Appointment, Billing
        
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Add sample customers
        customers = [
            Customer(name="John Kamau", phone="+254712345678", email="john@example.com"),
            Customer(name="Mary Wanjiku", phone="+254723456789", email="mary@example.com"),
            Customer(name="Peter Ochieng", phone="+254734567890", email="peter@example.com")
        ]
        
        for customer in customers:
            db.session.add(customer)
        
        # Add sample services
        services = [
            Service(name="Oil Change", price=1500.0),
            Service(name="Brake Pad Replacement", price=4000.0),
            Service(name="Engine Tune-up", price=3000.0),
            Service(name="Tire Rotation", price=1000.0),
            Service(name="Wheel Alignment", price=2500.0)
        ]
        
        for service in services:
            db.session.add(service)
        
        db.session.commit()
        
        print("Sample data added successfully!")

if __name__ == '__main__':
    seed_data()