import { Amplify, API, graphqlOperation } from "aws-amplify";

 import awsconfig from "./aws-exports";
 import { createWinners } from "./graphql/mutations";
 import { listWinners } from "./graphql/queries";
import { onCreateWinners } from "./graphql/subscriptions";

 Amplify.configure(awsconfig);

////////////////////////Highest rating question////////////////////
const question = document.querySelector('#quiz-body h3')
const answerBody = document.querySelector('#answer-body')
const modal = document.querySelector('.modal')
const startButton = document.querySelector('#start-button')
const closeButton = document.querySelector(".close-button");
const message = document.querySelector("#message")
const quizBody = document.querySelector('#quiz-body')
const modalContent = document.querySelector('.modal-content')
const ratingAnswer = document.querySelector('#rating-answer')

let currentColor = ''

const header = document.querySelector('header')

const ratingArray = []
const showNameArray = []
const genreArray = []
const imageArray = []
const showIdArray = []
const premiereArray = []
let finalIndex1
let finalIndex2
const loseIMG = document.createElement('img')
modalContent.append(loseIMG)

//////////////////////FETCH DATA FROM THE API/////////////////////////
fetch('https://api.tvmaze.com/shows')
.then(res => res.json())
.then(shows => {
    shows.forEach(show => {
        showIdArray.push(show.id)
        ratingArray.push(show.rating.average)
        showNameArray.push(show.name)
        genreArray.push(show.genres)
        imageArray.push(show.image.original)
        premiereArray.push(show.premiered)
    })
})
////////////////////////////////////////////////////

let clickCount = 0
let p = document.querySelector('p')
let points = 0
let pointsWin = 0
p.textContent = `Points: ${points}`


//function to toggle the visibility of the pop up
function toggleModal() {
    modal.classList.toggle("show-modal");
}

//add event listener for the close button on the pop up message
closeButton.addEventListener('click',() => {
    toggleModal()
    ratingAnswer.innerHTML += `<span>${showNameArray[finalIndex1]}:</span> <span>${ratingArray[finalIndex1]}</span> <br> <br> <span>${showNameArray[finalIndex2]}:</span> <span>${ratingArray[finalIndex2]}</span>`
    if(pointsWin > 3){
        ratingAnswer.innerHTML = ''
        pointsWin = 0
        message.textContent = ''
    }
})

//add event listener on the start/next button
startButton.addEventListener('click', () => {
    //remove instructions
    const body = document.querySelector('body')
    body.style.backgroundImage = "url('')"
    ratingAnswer.innerHTML = ''
    clickCount += 1
    if(clickCount === 1){
        const h4 = document.querySelector('h4')
        h4.remove()
    }

    if(points < 3){
        if(points === 0){
            //hide the name submit 
            winnerBox.style.visibility = 'hidden'
        }
        //increment for each click
        clickCount += 1
        //populate content of the inital question
        startButton.textContent = 'Next'
        question.textContent = 'Which TV show has the highest rating?'
        //run function to pull ratings for the two shows
        pullRatings()
        //disable start button
        startButton.disabled = true
    }
    //if you hit 5 in a row on the ratings questions you go to the final question
    if (points === 3) {
        //hide the start button
        startButton.style.visibility = 'hidden'
        /////////////////////////CREATE SECOND QUESTION////////////////////////
        //RNG a show
        let index = Math.floor(Math.random()*showIdArray.length)
        //create form to handle submit of typed in answer
        const form = document.createElement('form')
        form.id = "answer-form"
        //create input field to enter text
        const inputText = document.createElement('input')
        inputText.id = "input-text"
        inputText.type = "text"
        inputText.placeholder = "Type in your answer :)"
        form.append(inputText)
        //create input field to click submit button
        const inputSubmit = document.createElement('input')
        inputSubmit.id = "answer-submit"
        inputSubmit.type = "submit"
        inputSubmit.textContent = "SUBMIT"
        form.append(inputSubmit)
        //change text of h3 content
        const h3 = document.querySelector('#quiz-body h3')
        h3.textContent = 'What year did this show premiere?'
        //change image to have image appear
        const img = document.querySelector('#tv-image')
        img.src = imageArray[index]
        //add form before the br
        let br = document.querySelector('#quiz-body br')
        quizBody.insertBefore(form,br)
        //get year the show premiered
        let premiereYear = premiereArray[index]
        premiereYear = premiereYear.slice(0,4)
  
 
        //add event listener to the submit button and check if correct
        form.addEventListener('submit', (e) => {
            ratingAnswer.innerHTML = ''
            e.preventDefault()
            pointsWin = 5
            
            if (+e.target['input-text'].value === +premiereYear) {
                toggleModal()
                loseIMG.src = ''
                winnerBox.style.visibility = 'visible'
                message.textContent = 'Add your name to the list of winners!'
                modalContent.style.backgroundImage = "url('https://c.tenor.com/qNPpRT04stcAAAAC/you-won-willy-wonka-and-the-chocolate-factory.gif')"
                modalContent.style.height = '280px'
                modalContent.style.width = '498px'
                startButton.textContent = 'RESTART'
                points = 0
                p.textContent = `Points: ${points}`
                form.remove()
                document.querySelector('#tv-image').src = ''
                question.textContent = 'Please click RESTART'
            } else if (+e.target['input-text'].value !== +premiereYear) {
                toggleModal()
                message.textContent = premiereYear
                //changing to have losing image show up in popup
                //loseIMG.src = 'https://media1.giphy.com/media/sRMPFaVQLGSw8/giphy.gif?cid=790b761171c7d93a36e8a4013a0327e922079e3b8ae392e4&rid=giphy.gif&ct=g'
                //loseIMG.width = '350'
                modalContent.style.backgroundImage = "url('https://media1.giphy.com/media/sRMPFaVQLGSw8/giphy.gif?cid=790b761171c7d93a36e8a4013a0327e922079e3b8ae392e4&rid=giphy.gif&ct=g')"
                modalContent.style.height = '270px'
                modalContent.style.width = '450px'
                //modalContent.style.backgroundSize = 'cover'
                startButton.textContent = 'RESTART'
                points = 0
                p.textContent = `Points: ${points}`
                form.remove()
                document.querySelector('#tv-image').src = ''
                question.textContent = 'Please click RESTART'
            }
            startButton.style.visibility = 'visible'
        })
    }

})

//function to pull ratings of the shows
function pullRatings(){

    //randomize two shows    
    let a = Math.floor(Math.random()*showIdArray.length)
    let b = Math.floor(Math.random()*showIdArray.length)
    //make sure the shows data exists 
    while(ratingArray[a] === null || ratingArray[b] === null) {
        a = Math.floor(Math.random()*showIdArray.length)
        b = Math.floor(Math.random()*showIdArray.length)
    }
    //if the ratings of each show are the same, re-randomize show b
    while(ratingArray[a] === ratingArray[b]) {
        b = Math.floor(Math.random()*showIdArray.length)
    }
    
    const buttonOne = document.createElement('button')
    buttonOne.className = 'btn'
    //adding id
    buttonOne.id = 'buttonOne'
    const imgOne = document.createElement('img')
    imgOne.height = '250'
    imgOne.src = imageArray[a]
    buttonOne.append(imgOne)
  

    const buttonTwo = document.createElement('button')
    buttonTwo.className = 'btn'
    //adding id
    buttonTwo.id = 'buttonTwo'
    const imgTwo = document.createElement('img')
    imgTwo.height = '250'
    imgTwo.src = imageArray[b]
    buttonTwo.append(imgTwo)
   
    answerBody.append(buttonOne, buttonTwo)


    ///MOUSEOVER EVENT///////
    //const header = document.querySelector('header')
    document.querySelectorAll('.btn').forEach(btn => {
    
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = currentColor
        })
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'white'
        })

    })
    //////BUTTON CLICK////////////////
    buttonOne.addEventListener('click', () => buttonHandler(a, b))
    buttonTwo.addEventListener('click', () => buttonHandler(b, a))
    //////////////////////////
}

///////////////////////////////////////////////////


////// Function to create button handler/////////
const buttonHandler = (show1, show2) => {
    
    finalIndex1 = show1
    finalIndex2 = show2
    startButton.disabled = false

    if (ratingArray[show1] > ratingArray[show2]) {
        points ++
        pointsWin++
        p.textContent = `Points: ${points}`
        toggleModal()
        if(points === 3) {
            loseIMG.src = ''
            message.textContent = 'CONGRATS, Continue to the final question'
            question.textContent = 'Please click Next'
            modalContent.style.backgroundImage = ''
            modalContent.style.height = ''
            modalContent.style.width = '25rem'
        } else {
            loseIMG.src = ''
            //message.textContent = 'CORRECT'
            question.textContent = 'Please click Next'
            modalContent.style.backgroundImage = "url('https://acegif.com/wp-content/uploads/gif-good-job-80.gif')"
            modalContent.style.height = '400px'
            modalContent.style.width = '500px'
        }
        
    } else {
        question.textContent = 'Please click RESTART'
        startButton.textContent = 'RESTART'
        loseIMG.src = ''
        points = 0
        pointsWin = 0
        p.textContent = `Points: ${points}`
        toggleModal()
        message.textContent = ''
        // const loseIMG = document.createElement('img')
        modalContent.style.backgroundImage = "url('https://img.freepik.com/free-vector/glitch-game-background_23-2148085610.jpg')"
        modalContent.style.height = '300px'
        modalContent.style.width = '300px'
        //modalContent.style.backgroundSize = 'contain'

        
    }
    
    buttonOne.remove()
    buttonTwo.remove()
}
///////



//////WINNERS BOARD//////
const winnerBox = document.querySelector('#name-box')
const winnerList = document.querySelector('#winner-list')
const url = 'http://localhost:3000/winners'

async function getData() {
    API.graphql(graphqlOperation(listWinners)).then((evt) => {
    evt.data.listWinners.items.forEach(winner => populateList(winner))
    });
}

getData()

// fetch(url)
// .then(res => res.json())
// .then(winners => winners.forEach(winner => populateList(winner)))

const populateList = (winner) => {
    const div = document.createElement('div')
    div.innerHTML = `&#128250; ${winner.name}`
    winnerList.append(div)
}



winnerBox.addEventListener('submit', (e) => {
    e.preventDefault()
    const newName = e.target.name.value

    async function createNewWinner() {
        const winner = {
          name: newName
        };
     
        return await API.graphql(graphqlOperation(createWinners, { input: winner }));
    }

    createNewWinner().then((evt) => {
        populateList(evt.data.createWinners)
    })

    // fetch(url, {
    //     method: 'POST',
    //     headers : {
    //         'Content-Type' : 'application/json'
    //     },
    //     body: JSON.stringify({
    //         name : newName,

    //     }),
    // })
    // .then(res => res.json())
    // .then(data => populateList(data))

    winnerBox.reset()
})

/////////////////////////////////////////////

////////////////    CHANGE COLOR OF THE HEADER BACKGROUND BY RNG ////////////

const hexNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
const changeBtn = document.querySelector('#change-color')
//const header = document.querySelector('header')
changeBtn.addEventListener('mouseenter', () => {
    changeBtn.style.backgroundColor = 'white'
})
changeBtn.addEventListener('mouseleave', () => {
    changeBtn.style.backgroundColor = '#1d1c1c'
})

changeBtn.addEventListener('click', getHex)
function getHex() {
    let hexCol = "#";
    for(let i = 0; i < 6; i++) {
        let random = Math.floor(Math.random()* hexNumbers.length);
        hexCol += hexNumbers[random];
    }
    currentColor = hexCol
  
    header.style.backgroundImage = `linear-gradient(${hexCol}, white)`;
};
///////////////////////////////////////












/////////////////////////
