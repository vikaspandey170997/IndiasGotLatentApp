import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress, Snackbar, Alert, LinearProgress } from '@mui/material';

const MAX_FILE_SIZE_MB = 50;

const PostUpload: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);

    const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileSizeMB = selectedFile.size / (1024 * 1024);

            if (!selectedFile.type.startsWith('video/')) {
                setErrorMessage('Only video files are allowed.');
                setVideoFile(null);
                setVideoPreviewUrl(null);
                return;
            }

            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
                setVideoFile(null);
                setVideoPreviewUrl(null);
                return;
            }

            setVideoFile(selectedFile);
            setVideoPreviewUrl(URL.createObjectURL(selectedFile));
            setErrorMessage(null);
        }
    };

    const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileSizeMB = selectedFile.size / (1024 * 1024);

            if (!selectedFile.type.startsWith('image/')) {
                setErrorMessage('Only image files are allowed.');
                setImageFile(null);
                setImagePreviewUrl(null);
                return;
            }

            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
                setImageFile(null);
                setImagePreviewUrl(null);
                return;
            }

            setImageFile(selectedFile);
            setImagePreviewUrl(URL.createObjectURL(selectedFile));
            setErrorMessage(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!videoFile && !imageFile) {
            setErrorMessage('Please upload a video or image file.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (videoFile) formData.append('Video', videoFile);
        if (imageFile) formData.append('Image', imageFile);

        try {
            const response = await axios.post('https://localhost:7057/api/Posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                },
            });

            setSuccessMessage('Post uploaded successfully!');
            setTitle('');
            setContent('');
            setVideoFile(null);
            setImageFile(null);
            setVideoPreviewUrl(null);
            setImagePreviewUrl(null);
        } catch (err) {
            console.error(err);
            setErrorMessage('Failed to upload the post. Please try again.');
        } finally {
            setIsSubmitting(false);
            setProgress(0);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Typography className="align-content: center" variant="h5" gutterBottom>
                Upload a Post
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </Box>

                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Content"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={content}
                        onChange={handleContentChange}
                        required
                    />
                </Box>

                <Box mb={2}>
                    <Button variant="contained" component="label">
                        Upload Video
                        <input type="file" hidden accept="video/*" onChange={handleVideoFileChange} />
                    </Button>
                </Box>

                {videoPreviewUrl && (
                    <Box mb={2}>
                        <video src={videoPreviewUrl} controls style={{ maxWidth: '100%', maxHeight: 400 }} />
                    </Box>
                )}

                <Box mb={2}>
                    <Button variant="contained" component="label">
                        Upload Image
                        <input type="file" hidden accept="image/*" onChange={handleImageFileChange} />
                    </Button>
                </Box>

                {imagePreviewUrl && (
                    <Box mb={2}>
                        <img src={imagePreviewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 400 }} />
                    </Box>
                )}

                {progress > 0 && progress < 100 && (
                    <Box mb={2}>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="body2">{`Uploading... ${progress}%`}</Typography>
                    </Box>
                )}

                <Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={24} /> : null}
                    >
                        {isSubmitting ? 'Uploading...' : 'Upload Post'}
                    </Button>
                </Box>
            </form>

            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
                <Alert severity="error" onClose={() => setErrorMessage(null)}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
                <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PostUpload;