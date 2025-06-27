let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const toyCollection = document.getElementById('toy-collection');

function createToyCard(toy) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  
  const likeBtn = card.querySelector('.like-btn');
  likeBtn.addEventListener('click', () => handleLike(toy, card));

  return card;
}

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));
}


fetchToys();
const toyForm = document.querySelector('form'); // or '#new-toy-form'

toyForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const nameInput = toyForm.elements['name'].value;
  const imageInput = toyForm.elements['image'].value;

  const newToy = {
    name: nameInput,
    image: imageInput,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy)
  })
  .then(resp => resp.json())
  .then(toy => {
    const card = createToyCard(toy);
    toyCollection.appendChild(card);
    toyForm.reset();
  })
  .catch(error => console.error('Error adding toy:', error));
});
function handleLike(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(resp => resp.json())
  .then(updatedToy => {
    toy.likes = updatedToy.likes; // Update local toy object
    // Update likes count in the card
    const likesP = card.querySelector('p');
    likesP.textContent = `${updatedToy.likes} Likes`;
  })
  .catch(error => console.error('Error updating likes:', error));
}
