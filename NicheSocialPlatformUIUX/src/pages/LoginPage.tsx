import React, { useState } from 'react';
import axios from 'axios';
import {Container,Typography,TextField, Button, Stack, Alert, Divider, Link} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google's Material-UI icon
import { useNavigate } from 'react-router-dom';

interface LoginDto {
  email: string;
  password: string;
}

interface ErrorResponse {
  code: string;
  description: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Clear previous errors
    setErrors([]);
    setLoading(true);

    try {
      const response = await axios.post('https://localhost:7057/api/Account/login', {
        email,
        password
      } as LoginDto);

      localStorage.setItem("token", response.data.token);
      navigate("/postupload");

      // Handle successful login, e.g., redirect or update application state
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors([{ code: 'UnknownError', description: 'An unexpected error occurred.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    // Implement OAuth login with the provider
    window.location.href = `https://your-auth-server.com/auth/${provider}`;
  };

  return (
    <Container component="main" maxWidth="xs">
      {/* <Typography component="h1" variant="h5">
        Sign In
      </Typography> */}
      <form onSubmit={handleLogin}>
        <Stack spacing={2} mt={2}>
          <TextField
            variant="outlined"
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          {errors.length > 0 && (
            <Stack spacing={2} mt={2}>
              {errors.map((error, index) => (
                <Alert key={index} severity="error">
                  {error.description}
                </Alert>
              ))}
            </Stack>
          )}
          <Divider>or</Divider>
          <Stack spacing={2} mt={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => handleOAuth('google')}
              startIcon={<GoogleIcon />}
            >
              Login with Google
            </Button>
            {/* Add more OAuth providers as needed */}
          </Stack>
          <Stack spacing={2} mt={2}>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
            <Link href="/Register" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default Login;
