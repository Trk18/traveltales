import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import axios from "axios";
import PlaceForm from "../GuideComponents/PlaceForm";
import ViewPlace from "../GuideComponents/ViewPlace";
import GuideNavbar from "../GuideComponents/GuideNavbar";
import HomePage from "../Components/HomePage";

// Mock axios and react-router-dom
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: undefined }),
}));

describe('PlaceForm Component', () => {
  const renderPlaceForm = () => {
    render(
      <Router>
        <PlaceForm />
      </Router>
    );
  };

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    global.URL.revokeObjectURL = jest.fn();
  });
  
  afterAll(() => {
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  test('frontend_placeform_rendersCreateTitle', () => {
    renderPlaceForm();
    expect(screen.getByText('Create New Place')).toBeInTheDocument();
  });

  test('frontend_placeform_displaysRequiredFields', () => {
    renderPlaceForm();
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/best time to visit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/place image/i)).toBeInTheDocument();
  });

  test('frontend_placeform_showsValidationErrors', async () => {
    renderPlaceForm();
    const submitButton = screen.getByRole('button', { name: /add place/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Category is required')).toBeInTheDocument();
      expect(screen.getByText('Location is required')).toBeInTheDocument();
      expect(screen.getByText('Best time to visit is required')).toBeInTheDocument();
      expect(screen.getByText('Image is required')).toBeInTheDocument();
    });
  });

  test('frontend_placeform_handlesNewPlaceSubmission_navigatesToPlaceList', async () => {
    axios.post.mockResolvedValue({ status: 201 });
  
    renderPlaceForm();
  
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Place' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Beach' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Hawaii' } });
    fireEvent.change(screen.getByLabelText(/best time to visit/i), { target: { value: 'Summer' } });
  
    const file = new File(['dummy content'], 'place.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText(/place image/i), { target: { files: [file] } });
  
    fireEvent.click(screen.getByRole('button', { name: /add place/i }));
  });
});

describe('ViewPlace Component', () => {
  const mockPlaces = [
    {
      placeId: 1,
      name: 'Test Place',
      category: 'Beach',
      location: 'Hawaii',
      bestTimeToVisit: 'Summer',
      placeImage: 'test-image-url'
    }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ status: 200, data: mockPlaces });
  });

  const renderViewPlace = () => {
    render(
      <Router>
        <ViewPlace />
      </Router>
    );
  };

  test('frontend_viewplace_rendersTableCorrectly', async () => {
    renderViewPlace();
    await waitFor(() => {
      expect(screen.getByText('Places')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });
  });

  test('frontend_viewplace_displaysApiData', async () => {
    renderViewPlace();
    await waitFor(() => {
      expect(screen.getByText('Test Place')).toBeInTheDocument();
      expect(screen.getByText('Beach')).toBeInTheDocument();
      expect(screen.getByText('Hawaii')).toBeInTheDocument();
    });
  });

  test('frontend_viewplace_handlesDeleteConfirmation', async () => {
    renderViewPlace();
    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      expect(screen.getByText('Are you sure you want to delete this place?')).toBeInTheDocument();
    });
  });

  test('frontend_viewplace_handlesEmptyState', async () => {
    axios.get.mockResolvedValue({ status: 200, data: [] });
    renderViewPlace();
    await waitFor(() => {
      expect(screen.getByText('Oops! No places found.')).toBeInTheDocument();
    });
  });
});

describe('GuideNavbar Component', () => {
  beforeEach(() => {
    localStorage.setItem('userName', 'TestUser');
    localStorage.setItem('userRole', 'Admin');
  });

  const renderNavbar = () => {
    render(
      <Router>
        <GuideNavbar />
      </Router>
    );
  };

  test('frontend_navbar_rendersTitle', () => {
    renderNavbar();
    expect(screen.getByText('Travel Tales')).toBeInTheDocument();
  });

  test('frontend_navbar_containsNavigationLinks', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Place')).toBeInTheDocument();
  });
});

describe('HomePage Component', () => {
  const renderHomePage = () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );
  };

  test('frontend_homepage_rendersMainContent', () => {
    renderHomePage();
    expect(screen.getByText('Travel Tales', { selector: 'div.title' })).toBeInTheDocument();
    expect(screen.getByText(/Discover, create, and share unique travel experiences with a community of fellow enthusiasts./)).toBeInTheDocument();
  });

  test('frontend_homepage_displaysContactInfo', () => {
    renderHomePage();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Email: example@example.com')).toBeInTheDocument();
    expect(screen.getByText('Phone: 123-456-7890')).toBeInTheDocument();
  });

  test('frontend_homepage_includesNavigation', () => {
    renderHomePage();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});