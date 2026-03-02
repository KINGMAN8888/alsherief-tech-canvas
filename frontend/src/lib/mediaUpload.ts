import api from '@/lib/api';

export const uploadMediaFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.url as string;
};
