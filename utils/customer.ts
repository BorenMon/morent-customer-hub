import api from './authAPI';
import { toast } from './alert';

// Define the shape of the user profile
interface UserProfile {
  id: string;
  avatar?: string;
  [key: string]: any;
}

// Fetch the user's profile, optionally refreshing the data
export const fetchProfile = async (refresh: boolean = false): Promise<UserProfile | null> => {
  let profile: UserProfile | null = null;

  if (!refresh) {
    const storedProfile = localStorage.getItem('profile');
    profile = storedProfile ? JSON.parse(storedProfile) : null;

    if (!profile && localStorage.getItem('access_token')) {
      const response = await api.get('/users');
      if (response.status === 200) {
        profile = response.data.data[0];
        localStorage.setItem('profile', JSON.stringify(profile));
      }
    }
  } else {
    if (localStorage.getItem('access_token')) {
      const response = await api.get('/users');
      if (response.status === 200) {
        profile = response.data.data[0];
        localStorage.setItem('profile', JSON.stringify(profile));
      }
    }
  }

  return profile;
}

// Update the profile in localStorage
function updateLocalProfile(data: UserProfile): void {
  localStorage.setItem('profile', JSON.stringify(data));
}

// Update the profile image
export async function updateProfileImage(fileInput: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', fileInput);

    const uploadResponse = await api.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const fileId = uploadResponse.data.data.id;

    const profile = await fetchProfile();
    if (!profile) throw new Error('Profile not found');

    const updateResponse = await api.patch(`/users/${profile.id}`, {
      avatar: fileId,
    });

    const data = updateResponse.data.data;
    updateLocalProfile(data);

    toast('Profile updated successfully', 'success');

    return data.avatar || null;
  } catch (error: any) {
    toast(`Error updating profile image: ${error.message}`, 'error');
    return null;
  }
}

// Remove the profile image
export async function removeProfileImage(): Promise<void> {
  try {
    const profile = await fetchProfile();
    if (!profile || !profile.avatar) {
      console.warn('No profile image to remove.');
      return;
    }

    const fileId = profile.avatar;

    await api.patch(`/users/${profile.id}`, { avatar: null });

    const updateResponse = await api.patch(`/users/${profile.id}`, {
      avatar: null,
    });

    const updatedData = updateResponse.data.data;
    updateLocalProfile(updatedData);

    await api.delete(`/files/${fileId}`);
    console.log('Profile image and file removed successfully.');
  } catch (error: any) {
    console.error('Error removing profile image:', error.message);
    throw error;
  }
}
