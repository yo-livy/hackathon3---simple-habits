function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const currentSrc = darkModeToggle.getAttribute("src");
  const lightModeSrc = "imgMoon.png";
  const darkModeSrc = "imgSun.png";

  if (currentSrc === lightModeSrc) {
    darkModeToggle.setAttribute("src", darkModeSrc);
  } else {
    darkModeToggle.setAttribute("src", lightModeSrc);
  }
}



const plusButton = document.querySelector('.plus');
const popup = document.getElementById('popup');
const closeButton = document.querySelector('.close');
const addCardButton = document.getElementById('addCardButton');


popup.style.display = 'none';

plusButton.addEventListener('click', function() {
  popup.style.display = 'block';
  plusButton.style.display = 'none';
});

closeButton.addEventListener('click', function() {
  popup.style.display = 'none';
  plusButton.style.display = 'block';
});

function updateCounter() {
  const textarea = document.getElementById('content');
  const counter = document.getElementById('counter');
  const maxLength = parseInt(textarea.getAttribute('maxlength'), 10);
  const currentLength = textarea.value.length;
  const remainingLength = maxLength - currentLength;

  counter.textContent = `${remainingLength} character${remainingLength !== 1 ? 's' : ''} remaining`;
}


const tagSelect = document.getElementById('tag')

const getTags = async () => {
  console.log('TEST GET TAGS')
  const response = await fetch('http://127.0.0.1:8000/tags');
  const tagsData = await response.json();
  tagsData.forEach(element => {
    const option = document.createElement('option');
    option.textContent = element.tag;
    tagSelect.appendChild(option);
    console.log(option)
  })
}
getTags()


addCardButton.addEventListener('click', function() {
  plusButton.style.display = 'block';
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const authorInput = document.getElementById('author');
  const title = titleInput.value;
  const content = contentInput.value;
  const author = authorInput.value;
  const tag = tagSelect.value;

  if (title && content && author && tag) {
    const dataToPost = {
      title: title,
      content: content,
      author: author,
      tag: tag
    }
    const urlToPost = 'http://127.0.0.1:8000/postcards/';

    async function postData(url, data) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('Error:', response.status);
        }
    
        const responseData = await response.json();
        console.log('Response:', responseData);
        alert('Your post has been submitted for review')
      } catch (error) {
        console.error(error);
      }
    }
    
    postData(urlToPost, dataToPost);


    // Clear the input fields
    titleInput.value = '';
    contentInput.value = '';
    tagSelect.value = '';

    // Close the popup
    popup.style.display = 'none';
  } else {
    alert('Please fill in all the fields.');
    plusButton.style.display = 'none';
  }
});


const getCards = async () => {
  console.log('test')
  const response = await fetch('http://127.0.0.1:8000/postcards/')
  const cards = await response.json()
  console.log(cards)
  displayCards(cards)
}

const cardsSection = document.querySelector('.cards');

let activeTag = null;

const displayCards = cardsArray => {
    cardsSection.innerHTML = '';

    const tags = {};

    if (cardsArray.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No cards yet';
        message.id = 'message';
        cardsSection.appendChild(message);
    } else {
        let filteredArray = cardsArray;
        if (activeTag) {
            filteredArray = cardsArray.filter(card => card['tag'] === activeTag);
        }
        filteredArray.forEach(card => {
            const div = document.createElement('div');
            div.classList.add('info');
            cardsSection.appendChild(div);

            const imgContainer = document.createElement('div');
            imgContainer.classList.add('imgContainer');
            imgContainer.style.backgroundImage = `url("/Users/yo.livy/Desktop/Hackathon/django_mind_top${card['tag_image']}")`;
            div.appendChild(imgContainer);

            const p1 = document.createElement('p');
            p1.className = 'title';
            const p2 = document.createElement('p');
            p2.className = 'contentText';
            const p3 = document.createElement('p');
            p3.className = 'contentAuthor';
            const p4 = document.createElement('p');
            p4.className = 'hashtag';
            p1.textContent = card['title'];
            p2.textContent = card['content'];
            p3.textContent = card['author'];
            p4.textContent = `#${card['tag']}`;
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(p3);
            div.appendChild(p4);

            // Count the occurrence of each tag
            if (tags.hasOwnProperty(card['tag'])) {
                tags[card['tag']] += 3;
            } else {
                tags[card['tag']] = 1;
            }
        });

        const cloudTags = document.querySelector('.cloud-tags');

        // only recreate tags if no active tag
        if (!activeTag) {
            cloudTags.innerHTML = '';

            // Create and display the cloud tags
            Object.entries(tags).forEach(([tag, count]) => {
                const tagElement = document.createElement('span');
                tagElement.textContent = `#${tag}`;
                tagElement.style.fontSize = `${16 + count}px`; // Increase font size based on count
                tagElement.style.marginRight = '10px'; // Add space to the right of the tag
                tagElement.className = 'tagElement';
                cloudTags.appendChild(tagElement);

                // Add click event listener to filter cards by tag
                tagElement.addEventListener('click', () => {
                    activeTag = tag;
                    displayCards(cardsArray);
                });
            });

            // Add a tag to show all cards
            const showAllTagElement = document.createElement('span');
            showAllTagElement.textContent = 'Show all';
            showAllTagElement.style.marginLeft = '10px'; // Add space to the left of the 'Show all' tag
            showAllTagElement.className = 'showAllTags';
            cloudTags.appendChild(showAllTagElement);

            // Add click event listener to show all cards
            showAllTagElement.addEventListener('click', () => {
                activeTag = null;
                displayCards(cardsArray);
            });
        }
    }
    console.log('finish');
};

// displayCards(cards);
getCards();
