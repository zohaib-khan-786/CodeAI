import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');


let loadInterval;

function loader(element) {
  element.textContent = '';
  
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++
    } else {
      clearInterval(interval);
    }
  }, 20);
}


function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexaDecimalString}`;
}


function chatStrip(isAi, value, uniqueId) {
  return`
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" />
        </div>
        <div class = "message" id=${uniqueId}>${value}</div>
      </div>
    </div>
  `
}



const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user stripe

  chatContainer.innerHTML += chatStrip(false, data.get('prompt'));
  
  form.reset();



  // bot stripe

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStrip(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const responce = await fetch("https://codeai-tp8y.onrender.com", {
    "method": 'POST',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })


  clearInterval(loadInterval);
  messageDiv.innerHTML = '';


  if (responce.ok) {
    const data = await responce.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await responce.text();

    messageDiv.innerHTML = "Something Went Wrong";


    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})


