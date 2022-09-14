const quizForm = document.getElementById('quizForm');
const quizContainer = document.getElementById('quizContainer');
const quizCard = document.getElementById('quizCard');
const startQuiz = document.getElementById('startQuiz');
const imageQuiz = document.getElementById('imageQuiz');
const step = document.getElementById('step');
const progress = document.getElementById('progress');
const nextFlag = document.getElementById('nextFlag');
const ansCorrect = document.getElementById('ansCorrect');
const ansWrong = document.getElementById('ansWrong');
const maxSteps = 5;
let steps  = 0;
let errors = 0;
let selectedContinet;
let data;
let correctAns;
let userAns;
let answer;


async function wholeRegion(region) {
  if (region) {
      const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
      data = await res.json();
      selectCountry(data);
  }
}

function selectCountry(data) {
    const arrCountry = [];
    let country;
    let unique;
        while (true) {
            country = randomCountry(data);
            unique = true;
            if (arrCountry.length) {
                arrCountry.forEach(c => {
                    if (country.name.common === c.name.common ) unique = false; 
                })
            }
            if (unique) {
                arrCountry.push(country);
                if (arrCountry.length === 4) break;
            }
                
            
        }
    const randNum = Math.floor(Math.random() * 4);
    const quizCountry = arrCountry[randNum];
    correctAns = quizCountry.name.common;
    const html = `<h2 class="text-center" id="step">${steps}/5</h2>
        <div class="progress">
          <div
            class="progress-bar"
            role="progressbar"
            aria-label="Basic example"
            style="width: ${steps * 20}%"
            aria-valuenow="${steps * 20}"
            aria-valuemin="0"
            aria-valuemax="100"
            id="progress"
          ></div>
        </div>
        <div class="card mt-4 mx-auto" style="width: 22rem">
          <img src="${
            quizCountry.flags.svg
          }"class="card-img-top" alt="Quit Flag" id="imageQuiz" />
          <div class="card-body">
            <form id="form-check">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value="${arrCountry[0].name.common}"
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  ${arrCountry[0].name.common}
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  value="${arrCountry[1].name.common}"
                />
                <label class="form-check-label" for="flexRadioDefault2">
                  ${arrCountry[1].name.common}
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                 
        type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault3"
                  value="${arrCountry[2].name.common}"
                />
                <label class="form-check-label" for="flexRadioDefault3">
                  ${arrCountry[2].name.common}
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault4"
                  value="${arrCountry[3].name.common}"
                />
                <label class="form-check-label" for="flexRadioDefault4">
                  ${arrCountry[3].name.common}
                </label>
              </div>
            </form>
            <button type="submit" class="btn btn-primary p-2 mt-2" id="answer">
              Submit
            </button>
          </div>
        </div>`;
    clearQuizCard();
    quizCard.insertAdjacentHTML('afterbegin', html);
    answer = document.getElementById('answer');
    answer.addEventListener('click', checkAnswer);
}

function clearQuizCard(){
  quizCard.innerHTML = '';
}

function renderQuiz(e) {
    e.preventDefault();
    ansCorrect.style.display = 'none';
    ansWrong.style.display = 'none';
    nextFlag.style.visibility = 'hidden';
    if (!data) {
      selectedContinet = document.getElementById('continents').value;
      if (selectedContinet)  quizForm.style.display = 'none'; 
      document.getElementById('continents').value = '';
      wholeRegion(selectedContinet);
    } else {
      selectCountry(data);
    } 
}

function randomCountry(arr) {
    const len = arr.length;
    const randomNum = Math.floor(Math.random() * len);
    return arr[randomNum];
}

function checkAnswer(e) {
  e.preventDefault();
  ansCorrect.style.display = 'none';
  ansWrong.style.display = 'none';

  const allCheckboxes = document.querySelectorAll('.form-check-input');
  getAnswer(allCheckboxes);

  if(correctAns === userAns){
    ansCorrect.style.display = 'block';
    nextFlag.style.visibility = 'visible';
    steps++;
    if(steps === 5) {
      endQuiz();
      showResult(errors);
    }
  } else {
    ansWrong.style.display = 'block';
    errors++;
  }
}

function getAnswer(checkboxes) {
  checkboxes.forEach((checkBox) => {
    if (checkBox.checked){
       userAns = checkBox.value;
    };
  });
}

function endQuiz(){
  steps = 0;
  quizForm.style.display = 'block';
  ansCorrect.style.display = 'none';
  ansWrong.style.display = 'none';
  nextFlag.style.visibility = 'hidden';
  data = null
  selectedContinet = null;
  clearQuizCard();
}

function showResult(errors) {
  const errHtml = `
  <div class="alert alert-info text-center mt-5" role="alert">
  Congratulations you completed the quiz with ${errors} errors
  </div>
  `;
  quizCard.insertAdjacentHTML('beforeend', errHtml);
  errors = 0;
}


startQuiz.addEventListener('click', renderQuiz);
nextFlag.addEventListener('click', renderQuiz);