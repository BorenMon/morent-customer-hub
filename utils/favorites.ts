import api from './authAPI.js';
import Swal from 'sweetalert2';

export const checkIsFavorite = (carID: number, savedFavorites?: number[]) => {
  // If savedFavorites is undefined, fetch from localStorage
  savedFavorites = savedFavorites || JSON.parse(localStorage.getItem('savedFavorites') || '[]');

  const isFavorite = savedFavorites?.includes(carID);
  const iconPath = isFavorite
    ? '~/assets/icons/like.svg'
    : '~/assets/icons/heart-outline.svg'
  const oppositeIconPath = !isFavorite
    ? '~/assets/icons/like.svg'
    : '~/assets/icons/heart-outline.svg'

  return {
    isFavorite,
    iconPath,
    oppositeIconPath,
  }
}

// Function to handle the click event
function handleFavoriteClick(e: any) {
  if (window.location.pathname.includes('/pages/favorites')) {
      Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3563E9',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
      }).then((result) => {
          if (result.isConfirmed) {
              toggleFavorite(e);
              refreshFavoriteEvent();
          }
      });
  } else {
      toggleFavorite(e);
  }
}

export const refreshFavoriteEvent = () => {
  // Select all elements with the class 'favorite'
  var favorites = document.querySelectorAll('.favorite');
    
  // Loop through each element
  favorites.forEach(function(favorite) {
      // Remove the existing click event listener
      favorite.removeEventListener('click', handleFavoriteClick);
      
      // Attach the click event listener
      favorite.addEventListener('click', handleFavoriteClick);
  });
}

export const toggleFavorite = (e: any) => {
  const id = +e.target.parentElement.parentElement.dataset.id

  // Toggle favorite status
  const savedFavorites = JSON.parse(
    localStorage.getItem('savedFavorites') || '[]'
  )

  const removedFavorites = JSON.parse(
    localStorage.getItem('removedFavorites') || '[]'
  )

  const { isFavorite, oppositeIconPath } = checkIsFavorite(id, savedFavorites)

  // Add or remove car from favorites
  if (isFavorite) {
    savedFavorites.splice(savedFavorites.indexOf(id), 1)
    removedFavorites.push(id)
  } else {
    savedFavorites.push(id)
    removedFavorites.splice(removedFavorites.indexOf(id), 1)
  }

  e.target.src = oppositeIconPath

  // Update local storage
  localStorage.setItem('savedFavorites', JSON.stringify(savedFavorites))
  localStorage.setItem('removedFavorites', JSON.stringify(removedFavorites))

  if (localStorage.getItem('profile')) syncFavorites(savedFavorites, removedFavorites);
}

// Helper function: Fetch user favorites from the database
export async function fetchFavorites() {
  try {
    const response = await api.get(`/items/favorites`)
    return response.data.data.map((item: any) => item.car_id) || []
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    return []
  }
}

export async function syncFavorites(
  localFavorites: number[] = [],
  removeFavorites: number[] = []
): Promise<void> {
  try {
    // Parse favorites from localStorage with error handling
    const savedFavorites = localStorage.getItem('savedFavorites');
    const removedFavorites = localStorage.getItem('removedFavorites');
    
    localFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    removeFavorites = removedFavorites ? JSON.parse(removedFavorites) : [];

    // Fetch favorite cars from the database for this user
    const dbFavorites: number[] = await fetchFavorites();

    // Merge lists and remove duplicates
    let combinedFavorites: any[] = [...new Set([...localFavorites, ...dbFavorites])];

    combinedFavorites = combinedFavorites.filter(item => !removeFavorites.includes(item));

    // Store the merged list back to localStorage
    localStorage.setItem('savedFavorites', JSON.stringify(combinedFavorites));

    // Update the database with the merged list
    await updateFavorites(combinedFavorites.map(item => ({ car_id: item })));
  } catch (error) {
    console.error('Error syncing favorites:', error);
  }
}

// Helper function: Update user favorites in the database
export async function updateFavorites(favorites: any[]) {
  try {
    await api.delete(`items/favorites`, {
      "data": {
        "query": {
          "filter": {
            "client_id": {
              "_eq": JSON.parse(localStorage.getItem('profile') || '[]').id
            }
          }
        }
      }
    })
    await api.post(`items/favorites`, favorites)
  } catch (error) {
    console.error('Error updating user favorites:', error)
  }
}
