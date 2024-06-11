// Import React and necessary components
import React from 'react';
import Container from '../components/Container';
import FormWrap from '../components/FormWrap';
import RegisterForm from './RegisterForm';
import getCurrentUser from '@/actions/getCurrentUser';

// Register page component
// This page is responsible for fetching user data and rendering the registration form
const Register = async () => {
  // Fetch the current user data using the getCurrentUser action
  const currentUser = await getCurrentUser();

  // Render the Register page UI
  return (
    <Container>
      {/* Container component for layout */}
      <FormWrap>
        {/* FormWrap component for styling the form */}
        {/* RegisterForm component with the currentUser data passed as a prop */}
        <RegisterForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

// Export the Register page component
export default Register;
