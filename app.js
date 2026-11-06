
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.get('/test', (req, res) => {
    res.send('Lahari Petcare Updated Server is Working!');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lahari',
    database: 'petcare'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err.message);
        return;
    }

    console.log('MySQL Connected Successfully!');
});

// =====================================
// 1. OWNER MANAGEMENT
// =====================================

// Add owner
app.post('/api/owners', (req, res) => {

    const { ownerName, phone, email, address } = req.body;

    if (!ownerName || !phone) {
        return res.status(400).json({
            message: 'Owner name and phone are required'
        });
    }

    const sql = `
        INSERT INTO owners
        (owner_name, phone, email, address)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [
        ownerName,
        phone,
        email || '',
        address || ''
    ], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Unable to add owner: ' + err.message
            });
        }

        res.status(201).json({
            message: 'Owner added successfully!',
            ownerId: result.insertId
        });
    });
});

// Display owners
app.get('/api/owners', (req, res) => {

    const sql = 'SELECT * FROM owners ORDER BY owner_id DESC';

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(results);
    });
});


// =====================================
// 2. PET MANAGEMENT
// =====================================

// Add pet
app.post('/api/pets', (req, res) => {

    const {
        petName,
        species,
        breed,
        age,
        gender,
        ownerId
    } = req.body;

    if (!petName || !species || !ownerId) {
        return res.status(400).json({
            message: 'Pet name, species and owner ID are required'
        });
    }

    const sql = `
        INSERT INTO pets
        (pet_name, species, breed, age, gender, owner_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        petName,
        species,
        breed || '',
        age || 0,
        gender || '',
        Number(ownerId)
    ], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Unable to add pet: ' + err.message
            });
        }

        res.status(201).json({
            message: 'Pet registered successfully!',
            petId: result.insertId
        });
    });
});

// Display pets
app.get('/api/pets', (req, res) => {

    const sql = 'SELECT * FROM pets ORDER BY pet_id DESC';

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(results);
    });
});


// =====================================
// 3. APPOINTMENT MANAGEMENT
// =====================================

// Add appointment
app.post('/api/appointments', (req, res) => {

    const {
        ownerId,
        petId,
        appointmentDate,
        appointmentTime,
        reason,
        status
    } = req.body;

    if (!ownerId || !petId || !appointmentDate || !appointmentTime) {
        return res.status(400).json({
            message: 'Please provide all required appointment details'
        });
    }

    const sql = `
        INSERT INTO appointments
        (owner_id, pet_id, appointment_date,
         appointment_time, REASON, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        Number(ownerId),
        Number(petId),
        appointmentDate,
        appointmentTime,
        reason || '',
        status || 'Pending'
    ], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Unable to book appointment: ' + err.message
            });
        }

        res.status(201).json({
            message: 'Appointment booked successfully!',
            appointmentId: result.insertId
        });
    });
});

// Display appointments
app.get('/api/appointments', (req, res) => {

    const sql = `
        SELECT
            appointment_id,
            owner_id,
            pet_id,
            appointment_date,
            appointment_time,
            REASON AS reason,
            status
        FROM appointments
        ORDER BY appointment_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.json(results);
    });
});


// Return JSON for unknown API routes
app.use('/api', (req, res) => {
    res.status(404).json({
        message: 'API route not found'
    });
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
