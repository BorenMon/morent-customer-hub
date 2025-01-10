import Swal from 'sweetalert2';

// Define the possible values for the icon and position parameters
type ToastIcon = 'success' | 'error' | 'warning' | 'info' | 'question';
type ToastPosition = 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end';

export const toast = (title: string, icon: ToastIcon = 'success', position: ToastPosition = 'top-end'): void => {
  Swal.fire({
    toast: true,
    showConfirmButton: false,
    position,
    icon,
    title,
    timer: 3000,
  });
};
