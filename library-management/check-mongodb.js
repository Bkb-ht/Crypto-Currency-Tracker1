const { exec } = require('child_process');

console.log('🔍 Checking MongoDB status...\n');

// Check if MongoDB service is running
exec('sc query MongoDB', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ MongoDB service not found or not running');
    console.log('💡 Solutions:');
    console.log('1. Install MongoDB Community Server from: https://www.mongodb.com/try/download/community');
    console.log('2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('3. Or install using chocolatey: choco install mongodb');
    console.log('4. Or use Docker: docker run -d -p 27017:27017 mongo\n');
    
    // Try to connect anyway
    tryConnection();
  } else {
    console.log('✅ MongoDB service found');
    console.log(stdout);
    tryConnection();
  }
});

function tryConnection() {
  console.log('🔌 Testing MongoDB connection...');
  
  const mongoose = require('mongoose');
  
  mongoose.connect('mongodb://localhost:27017/library_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // 5 second timeout
  })
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('🎉 Your database is ready for the Library Management System');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('\n🛠️  Quick fixes:');
    console.log('1. Start MongoDB service: net start MongoDB');
    console.log('2. Or install MongoDB if not installed');
    console.log('3. Or use the system without database (limited functionality)');
  });
}