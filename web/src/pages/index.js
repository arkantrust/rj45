import HomePage from './home';
import SignInPage from './sign-in';
import SignUpPage from './sign-up';
import DashboardPage from './dashboard';
import ProfilePage from './sign-profile';
import PatientsPage from './patients';
import PatientDetailsPage from './patient-details';
import UsersPage from './users';
import UserDetailsPage from './user-details';
import TestDetailsPage from './test-details';

const pages = {
  profile: () => {
      const user = AuthService.getCurrentUser();
      return user ? `
          <div class="profile-container">
              <h1>Profile</h1>
              <p>Username: ${user.username}</p>
              <button id="logoutBtn">Logout</button>
          </div>
          <script>
              document.getElementById('logoutBtn').addEventListener('click', () => {
                  AuthService.logout();
              });
          </script>
      ` : window.router.navigate('/sign-in');
  },

  patients: async ({ query }) => {
      try {
          const patients = await PatientService.getAllPatients(query);
          return `
              <div class="patients-container">
                  <h1>Patients</h1>
                  <table>
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Email</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${patients.map(patient => `
                              <tr>
                                  <td><a href="/patients/${patient.id}" data-router-link>${patient.id}</a></td>
                                  <td>${patient.name}</td>
                                  <td>${patient.email}</td>
                              </tr>
                          `).join('')}
                      </tbody>
                  </table>
              </div>
          `;
      } catch (error) {
          return '<h1>Error loading patients</h1>';
      }
  },

  patientDetail: async ({ params }) => {
      try {
          const patient = await PatientService.getPatientById(params.id);
          return `
              <div class="patient-detail-container">
                  <h1>Patient Details</h1>
                  <p>ID: ${patient.id}</p>
                  <p>Name: ${patient.name}</p>
                  <p>Email: ${patient.email}</p>
              </div>
          `;
      } catch (error) {
          return '<h1>Patient Not Found</h1>';
      }
  }
};