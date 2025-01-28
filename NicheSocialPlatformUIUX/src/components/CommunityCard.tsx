import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

interface CommunityCardProps {
  name: string;
  description: string;
  members: number;
  onJoin: () => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ name, description, members, onJoin }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2">
          Members: {members}
        </Typography>
        <Button variant="contained" color="primary" onClick={onJoin}>
          Join Community
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;
