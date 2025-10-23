import React from 'react';
import { Typography, Container, Box } from '@mui/material';

// простой заглушечный компонент списка файлов
const FilesList = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Список файлов
        </Typography>
        <Typography>Здесь будет отображаться список файлов пользователя.</Typography>
      </Box>
    </Container>
  );
};

export default FilesList;