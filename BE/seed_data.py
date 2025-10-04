from app import app, db
from models import Customer, Service

def seed_data():
    with app.app_context():
        print("🌱 Seeding database with sample data...")
        
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Add sample customers
        customers = [
            Customer(name="John Kamau", phone="+254712345678", email="john@example.com"),
            Customer(name="Mary Wanjiku", phone="+254723456789", email="mary@example.com"),
            Customer(name="Peter Ochieng", phone="+254734567890", email="peter@example.com"),
            Customer(name="Sarah Mwende", phone="+254745678901", email="sarah@example.com"),
            Customer(name="David Njoroge", phone="+254756789012", email="david@example.com")
        ]
        
        for customer in customers:
            db.session.add(customer)
        
        # Add sample services
        services = [
            Service(name="Oil Change", price=1500.0),
            Service(name="Brake Pad Replacement", price=4000.0),
            Service(name="Engine Tune-up", price=3000.0),
            Service(name="Tire Rotation", price=1000.0),
            Service(name="Wheel Alignment", price=2500.0),
            Service(name="Battery Replacement", price=8000.0),
            Service(name="AC Service", price=3500.0),
            Service(name="Car Wash", price=500.0)
        ]
        
        for service in services:
            db.session.add(service)
        
        db.session.commit()
        print("✅ Sample data added successfully!")
        print(f"   • {len(customers)} customers created")
        print(f"   • {len(services)} services created")

if __name__ == '__main__':
    seed_data()