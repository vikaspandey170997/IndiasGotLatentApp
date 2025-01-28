import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Stack
} from '@mui/material';

interface RegisterDto {
  userName: string;
  email: string;
  password: string;
}

interface ErrorResponse {
  code: string;
  description: string;
}

const Register: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorResponse[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setErrors([]);

    try {
      const response = await axios.post('https://localhost:7057/api/Account/register', {
        userName,
        email,
        password
      } as RegisterDto);

      alert('User registered successfully!');
      // Otionally, redirect or clepar form after successful registration
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors([{ code: 'UnknownError', description: 'An unexpected error occurred.' }]);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs" >
      <Typography component="h1" variant="h5">
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mt={2}>
          <TextField
            variant="outlined"
            label="Username"
            fullWidth
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
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
        </Stack>
      </form>
    </Container>
  );
};

export default Register;
