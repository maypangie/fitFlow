var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


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


