import HomePage from '../pages/home.js'
import SignInPage from '../pages/sign-in.js'
import SignUpPage from '../pages/sign-up.js'
import DashboardPage from '../pages/dashboard.js'
import ProfilePage from '../pages/profile.js'
import PatientsPage from '../pages/patients.js'
import PatientDetailsPage from '../pages/patient-details.js'
import UsersPage from '../pages/users.js'
import UserDetailsPage from '../pages/user-details.js'
import TestDetailsPage from '../pages/test-details.js'
import NotFoundPage from '../pages/not-found.js'
import ErrorPage from '../pages/error.js'
import { getAccessToken } from './jwt.js';

export const routes = [
  { path: '/', view: (page, { params }) => HomePage(page) },
  { path: '/sign-in', view: async (page, { params }) => SignInPage(page) },
  { path: '/sign-up', view: (page, { params }) => SignUpPage(page) },
  { path: '/dashboard', view: (page, { params }) => DashboardPage(page), requireAuth: true },
  { path: '/profile', view: (page, { params }) => ProfilePage(page), requireAuth: true },
  { path: '/patients', view: (page, { params }) => PatientsPage(page), requireAuth: true },
  { path: '/patients/:id', view: async ({ params }) => PatientDetailsPage(page, param.id), requireAuth: true },
  { path: '/users', view: (page, { params }) => UsersPage(page), requireAuth: true },
  { path: '/users/:id', view: async ({ params }) => UserDetailsPage(page, param.id), requireAuth: true },
  { path: '/tests/:id', view: async (page, { params }) => TestDetailsPage(page, params.id), requireAuth: false }
];

export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this.page = document.getElementById('page');

    // Bind methods
    this.navigate = this.navigate.bind(this);
    this.handlePopState = this.handlePopState.bind(this);

    // Setup event listeners
    window.addEventListener('popstate', this.handlePopState);
    this.setupLinkInterception();
  }

  setupLinkInterception() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('data-router-link') !== null) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
  }

  // Normalize path by removing trailing slash and making sure it starts with /
  normalizePath(path) {
    return '/' + path.replace(/^\/|\/$/g, '');
  }

  // Match route with optional parameters
  matchRoute(path) {
    for (let route of this.routes) {
      const paramNames = [];
      const regexPath = route.path.replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      });

      const regex = new RegExp(`^${regexPath}$`);
      const match = path.match(regex);

      if (match) {
        const params = {};
        match.slice(1).forEach((value, index) => {
          params[paramNames[index]] = value;
        });
        return { route, params };
      }
    }
    return null;
  }

  async navigate(path, replace = false) {
    // Normalize path
    path = this.normalizePath(path);

    // Check query parameters
    const [cleanPath, queryString] = path.split('?');
    const queryParams = queryString
      ? Object.fromEntries(new URLSearchParams(queryString))
      : {};

    // Find matching route
    const matchedRoute = this.matchRoute(cleanPath);

    if (!matchedRoute) {
      // 404 handling
      this.page.innerHTML = '';
      NotFoundPage(this.page);
      return;
    }

    // Check authentication if required
    if (matchedRoute.route.requireAuth && !this.isAuthenticated()) {
      this.navigate('/sign-in');
      return;
    }

    // Update browser history
    const state = { path, queryParams: queryParams };
    if (replace) {
      history.replaceState(state, '', path);
    } else {
      history.pushState(state, '', path);
    }

    // Render the route
    try {
      this.page.innerHTML = '';
      await matchedRoute.route.view(
        this.page,
        {
          params: matchedRoute.params,
          query: queryParams
        }
      );
    } catch (error) {
      console.error('Route rendering error:', error);
      this.page.innerHTML = '';
      ErrorPage(this.page);
    }
  }

  handlePopState(event) {
    if (event.state) {
      this.navigate(event.state.path, true);
    }
  }

  isAuthenticated() {
    return !!getAccessToken();
  }
}