from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from routes import api
import os

def create_app():
    app = Flask(__name__)
    
    # Configuration - use absolute path for database
    base_dir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(base_dir, "garage.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your-secret-key-here'
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)  # Allow all origins for development
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Test routes
    @app.route('/')
    def home():
        return jsonify({
            "message": "Garage Management System API is running!",
            "status": "healthy"
        })
    
    @app.route('/api/health')
    def health():
        return jsonify({"status": "healthy", "message": "Backend server is running"})
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    # Initialize database
    with app.app_context():
        db.create_all()
        print("✅ Database initialized")
    
    print("🚀 Starting Garage Management System Backend...")
    print("📡 Server will be available at:")
    print("   http://localhost:5000")
    print("   http://127.0.0.1:5000")
    print("🔧 Debug mode: ON")
    
    try:
        # Try with 0.0.0.0 to ensure it's accessible
        app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Trying alternative configuration...")
        # Fallback to localhost
        app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)