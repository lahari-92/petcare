
// =====================================
// LAHARI PET CARE - FRONTEND JAVASCRIPT
// =====================================

// Function to safely display data in HTML

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (char) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char];
    });
}



// Function to display error messages
function showError(error) {
    alert(error.message || 'Something went wrong!');
}


// =====================================
// 1. OWNER MANAGEMENT
// =====================================

const ownerForm = document.getElementById('ownerForm');

if (ownerForm) {

    ownerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const ownerData = {
            ownerName: document.getElementById('ownerName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };

        try {
            const response = await fetch('/api/owners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ownerData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Unable to add owner');
            }

            alert('Owner added successfully!');
            ownerForm.reset();
            loadOwners();

        } catch (error) {
            showError(error);
        }
    });

    loadOwners();
}


// Display owner records
async function loadOwners() {

    const ownerList = document.getElementById('ownerList');

    if (!ownerList) return;

    try {
        const response = await fetch('/api/owners');

        if (!response.ok) {
            throw new Error('Unable to load owners');
        }

        const owners = await response.json();

        if (owners.length === 0) {
            ownerList.innerHTML =
                '<tr><td colspan="5">No owners registered yet.</td></tr>';
            return;
        }

        ownerList.innerHTML = owners.map(owner => `
            <tr>
                <td>${escapeHTML(owner.owner_id)}</td>
                <td>${escapeHTML(owner.owner_name)}</td>
                <td>${escapeHTML(owner.phone)}</td>
                <td>${escapeHTML(owner.email)}</td>
                <td>${escapeHTML(owner.address)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
    }
}


// =====================================
// 2. PET MANAGEMENT
// =====================================

const petForm = document.getElementById('petForm');

if (petForm) {

    petForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const petData = {
            petName: document.getElementById('petName').value,
            species: document.getElementById('species').value,
            breed: document.getElementById('breed').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            ownerId: document.getElementById('ownerId').value
        };

        try {
            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(petData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Unable to add pet');
            }

            alert('Pet registered successfully!');
            petForm.reset();
            loadPets();

        } catch (error) {
            showError(error);
        }
    });

    loadPets();
}


// Display pet records
async function loadPets() {

    const petList = document.getElementById('petList');

    if (!petList) return;

    try {
        const response = await fetch('/api/pets');

        if (!response.ok) {
            throw new Error('Unable to load pets');
        }

        const pets = await response.json();

        if (pets.length === 0) {
            petList.innerHTML =
                '<tr><td colspan="7">No pets registered yet.</td></tr>';
            return;
        }

        petList.innerHTML = pets.map(pet => `
            <tr>
                <td>${escapeHTML(pet.pet_id)}</td>
                <td>${escapeHTML(pet.pet_name)}</td>
                <td>${escapeHTML(pet.species)}</td>
                <td>${escapeHTML(pet.breed)}</td>
                <td>${escapeHTML(pet.age)}</td>
                <td>${escapeHTML(pet.gender)}</td>
                <td>${escapeHTML(pet.owner_id)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
    }
}


// =====================================
// 3. APPOINTMENT MANAGEMENT
// =====================================

const appointmentForm =
    document.getElementById('appointmentForm');

if (appointmentForm) {

    appointmentForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const appointmentData = {
            ownerId: document.getElementById('ownerId').value,
            petId: document.getElementById('petId').value,
            appointmentDate:
                document.getElementById('appointmentDate').value,
            appointmentTime:
                document.getElementById('appointmentTime').value,
            reason: document.getElementById('reason').value,
            status: document.getElementById('status').value
        };

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Unable to book appointment'
                );
            }

            alert('Appointment booked successfully!');
            appointmentForm.reset();
            loadAppointments();

        } catch (error) {
            showError(error);
        }
    });

    loadAppointments();
}


// Display appointment records
async function loadAppointments() {

    const appointmentList =
        document.getElementById('appointmentList');

    if (!appointmentList) return;

    try {
        const response = await fetch('/api/appointments');

        if (!response.ok) {
            throw new Error('Unable to load appointments');
        }

        const appointments = await response.json();

        if (appointments.length === 0) {
            appointmentList.innerHTML =
                '<tr><td colspan="7">No appointments booked yet.</td></tr>';
            return;
        }

        appointmentList.innerHTML = appointments.map(appointment => `
            <tr>
                <td>${escapeHTML(appointment.appointment_id)}</td>
                <td>${escapeHTML(appointment.owner_id)}</td>
                <td>${escapeHTML(appointment.pet_id)}</td>
                <td>${escapeHTML(appointment.appointment_date)}</td>
                <td>${escapeHTML(appointment.appointment_time)}</td>
                <td>${escapeHTML(appointment.reason)}</td>
                <td>${escapeHTML(appointment.status)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
    }
}


// =====================================
// END OF SCRIPT
// =====================================
