
async function markCompleted(workoutId) {
  try {
      const response = await fetch(`/workouts/${workoutId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
          window.location.reload(); // Reload the page to show the updated status
      } else {
          console.error('Failed to mark workout as completed');
      }
  } catch (error) {
      console.error('Error marking workout as completed:', error);
  }
}








async function deleteWorkout(workoutId) {
  try {
      await fetch(`/workouts/${workoutId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
      });
      window.location.reload();
  } catch (error) {
      console.error('Error deleting workout:', error);
  }
}


