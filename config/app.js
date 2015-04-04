var config = {
  port: process.env.PORT || 3000,

  mongo: {
    connect: process.env.MONGOHQ_URL || 'mongodb://localhost/brew'
  },

  spark: {
    token: process.env.SPARK_TOKEN,
    device1: process.env.SPARK_DEVICE_1
  }
};

module.exports = config;
