const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
      'mongodb+srv://MyMongoDBUser:apigee@cluster0.kez9g.mongodb.net/final_project?retryWrites=true&w=majority',
  stripe_connect_test_client_id: 'ca_JADPD4HoVcucYXzVg3ecepHKyiaC85o1',
  stripe_test_secret_key: 'sk_test_51IXsL8EXPIkGMjJvlTGFpJzRox8Wau9lmdJmQgxzR0KNiY57XmNYOssHKr1Z1M5CsW07oRr5auw9MQTaVtFeOfAS00aJgm4k5y',
  stripe_test_api_key: 'pk_test_51IXsL8EXPIkGMjJvpCqoLGYVpQQeZXBw50BYZMjUBRX1n7HgwrAolU9P4oBlcz29LThXENz1rcMsmoxhw0jhAFQs003lXLFuwf'
}

export default config
