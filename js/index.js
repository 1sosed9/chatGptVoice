// Змінні
let button = window.document.querySelector('button');
let p = window.document.querySelector('p');
let converstation = [];

// Для розпізнання мови
let speechRecognizer = new webkitSpeechRecognition();

// Для синтезу мови
let speechSynthesis = window.speechSynthesis;

// Функції
const speech = () => {
    speechRecognizer.start();
    button.innerText = "Говорите";
}

const talk = (text) => {
    let textToTalk = new SpeechSynthesisUtterance(text);
    textToTalk.rate = 1.5;
    textToTalk.pitch = 1;

    speechSynthesis.speak(textToTalk);
}

// Інтеграція з CHAT-GPT
let request = axios.create({
    headers: {
        Authorization: `Bearer ${apiKey}`
    }
})
const requestFunc = () => {
    if (p.innerText) {
        button.innerText = 'Отправка...'
        button.style.animation = 'button_anim 2s infinite';
        let message = {
            "role": "user",
            "content": `${p.innerText}`
        }
        converstation.push(message);
        let params = {
            "model": "gpt-3.5-turbo",
            "messages": converstation
        }
        request.post('https://api.openai.com/v1/chat/completions', params)
            .then(response => {
                p.innerText = response.data.choices[0].message.content;
                let gtpMessage = {
                    "role": "assistant",
                    "content": `${p.innerText}`
                }
                converstation.push(gtpMessage);
                button.innerText = 'Задать вопрос';
                button.style.animation = 'none';
                talk(p.innerText);
            });
    }
}

// Обробник подій 
speechRecognizer.onresult = (event) => {
    p.innerText = event.results[0][0].transcript;
    requestFunc();
}