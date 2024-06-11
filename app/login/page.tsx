// Import necessary modules and components.
import getCurrentUser from '@/actions/getCurrentUser';
import Container from '../components/Container';
import FormWrap from '../components/FormWrap';
import LoginForm from './LoginForm';

// Define the Login component.
const Login = async () => {
  // Fetch the current user's data.
  const currentUser = await getCurrentUser();

  // Render the Login component with Container and FormWrap.
  return (
    <Container>
      <FormWrap>
        <LoginForm currentUser={currentUser} />
      </FormWrap>
    </Container>
  );
};

// Export the Login component.
export default Login;
