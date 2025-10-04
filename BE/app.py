from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from routes import api
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"])
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Test route
    @app.route('/')
    def home():
        return jsonify({
            "message": "Garage Management System API is running!",
            "version": "1.0",
            "endpoints": {
                "health": "/api/health",
                "services": "/api/services",
                "appointments": "/api/appointments",
                "customers": "/api/customers",
                "billing": "/api/billing"
            }
        })
    
    # Health check route
    @app.route('/api/health')
    def health():
        return jsonify({
            "status": "healthy", 
            "message": "Backend server is running",
            "timestamp": "2024-01-04 10:00:00"
        })
    
    # Create tables
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")
    
    return app

# Create single app instance
app = create_app()

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Starting Garage Management System Backend")
    print("=" * 50)
    print("📡 Server URLs:")
    print("   • http://127.0.0.1:5000")
    print("   • http://localhost:5000")
    print("🔧 Debug mode: ON")
    print("💡 Make sure the frontend is running on port 5173 or 5174")
    print("=" * 50)
    
    try:
        app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)
    except OSError as e:
        if "Address already in use" in str(e):
            print("❌ Port 5000 is busy. Trying port 5001...")
            app.run(debug=True, host='127.0.0.1', port=5001, use_reloader=False)
        else:
            print(f"❌ Error starting server: {e}")