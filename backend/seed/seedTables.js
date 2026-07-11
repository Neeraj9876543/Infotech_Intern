require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('../models/Table');

const seedTables = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing tables
    await Table.deleteMany({});
    console.log('Cleared existing tables');

    // Seed tables
    const tables = [
      { tableNumber: '1', capacity: 2, isActive: true },
      { tableNumber: '2', capacity: 2, isActive: true },
      { tableNumber: '3', capacity: 4, isActive: true },
      { tableNumber: '4', capacity: 4, isActive: true },
      { tableNumber: '5', capacity: 6, isActive: true },
      { tableNumber: '6', capacity: 8, isActive: true }
    ];

    await Table.insertMany(tables);
    console.log('Tables seeded successfully');
    console.log('Seeded tables:');
    tables.forEach(table => {
      console.log(`- Table ${table.tableNumber}: Capacity ${table.capacity}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding tables:', error);
    process.exit(1);
  }
};

seedTables();
