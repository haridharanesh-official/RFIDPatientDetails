# Patient Portal — Static Prototype (Dynamic via JSON + localStorage)

This is a lightweight prototype you can run locally or host on Vercel.  
It uses `patients.json` as the seed data and persists changes into the browser's `localStorage` so you can add new patients dynamically.

## Features
- Login (demo): **admin / 1234**
- Add patient (fields: patientId, name, age, gender, allergies, medication, emergency contact)
- View patients table (click patient ID to open public patient page)
- Patient public view: `patient.html?id=<patientId>`
- Data persistence: localStorage (no server required)

## Run locally
1. Unzip the folder.
2. Serve files with a simple static server (recommended) or open `index.html` directly:
   - Recommended: use VS Code Live Server or Python http.server:
     ```bash
     cd patient-portal-dynamic-json
     python3 -m http.server 8000
     # then open http://localhost:8000
     ```
3. Login using `admin` / `1234`.
4. Add or view patients.

## Notes
- Changes are stored in your browser only (localStorage). To reset, clear localStorage or remove the key `patient_portal_patients_v1`.
- The prototype is ready to be uploaded to Vercel (or any static host).

