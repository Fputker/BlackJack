//
// BlackJack
// By Florian Putker
//

// Card variables
let suits = ['Hearts', 'Spades', 'Diamonds', 'Clubs']

let values = ['1', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2']

// Button variables
let dealertext = document.getElementById('dealer-text-area')

let playertext = document.getElementById('player-text-area')

let playertext2 = document.getElementById('player-text-area-2')

let newButton = document.getElementById('new-button')

let hitButton = document.getElementById('hit-button')

let stayButton = document.getElementById('stay-button')

let doubleButton = document.getElementById('double-button')

let splitButton = document.getElementById('split-button')

let cardDeckObject = document.getElementById('svgCards')
// cardDeckPictures = cardDeckObject.contentDocument;

// CardImages
// let dealerHandImage = document.getElementById('dealerHandImage');
// let playerHandImage = document.getElementById('playerHandImage');

// Game variables
let gameStarted = false

let gameOver = false

let playerWon = false

let splitHand = false

let playerSplitOneStayed = false

let dealerCards = []

let playerCards = []

let playerCards2 = []

let dealerScore = 0

let playerScore = 0

let playerScore2 = 0

let deck = []

hitButton.style.display = 'none'
stayButton.style.display = 'none'
doubleButton.style.display = 'none'
splitButton.style.display = 'none'
cardDeckObject.style.display = 'none'
showStatus()

newButton.addEventListener('click', function () {
  gameStarted = true
  gameOver = false
  playerWon = false

  deck = createCardDeck()
  shuffleDeck(deck)
  dealerCards = [ getNextCard(), getNextCard() ]
  playerCards = [ getNextCard(), getNextCard() ]

  newButton.style.display = 'none'
  hitButton.style.display = 'inline'
  stayButton.style.display = 'inline'

  checkForSplitOption()

  showStatus()
})

hitButton.addEventListener('click', function () {
  splitButton.style.display = 'none'

  if (playerSplitOneStayed === true) {
    playerCards2.push(getNextCard())
  } else {
    playerCards.push(getNextCard())
  }

  showStatus()
})

stayButton.addEventListener('click', function () {
  if (splitHand === false) {
    gameOver = true
  } else {
    playerSplitOneStayed = true
  }
  showStatus()
})

splitButton.addEventListener('click', function () {
  splitHand = true
  playerCards2.push(playerCards.pop())
  showStatus()
})

// Setting up the deck
function createCardDeck () {
  let deck = []
  let suitIdx = 0
  let valueIdx = 0
  for (suitIdx; suitIdx < suits.length; suitIdx++) {
    for (valueIdx; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx],
        imageID: createImageID(suits[suitIdx], values[valueIdx])
      }
      deck.push(card)
    }
  }
  return deck
}

function createImageID (suit, value) {
  imageID = value + '_' + suit
  return imageID
}

// Handling the deck
function shuffleDeck (deck) {
  for (idx = 0; idx < deck.length; idx++) {
    let swapIndex = Math.trunc(Math.random() * deck.length)
    let placeholder = deck[swapIndex]
    deck[swapIndex] = deck[idx]
    deck[idx] = placeholder
  }
}

function getNextCard () {
  return deck.shift()
}

function showCardInfo (card) {
  if (card.value === '1') {
    return 'Ace of ' + card.suit
  } else {
    return card.value + ' of ' + card.suit
  }
}

function handAsString (cardArray) {
  let cardHand = ''
  for (i = 0; i < cardArray.length; i++) {
    cardHand += showCardInfo(cardArray[i]) + '\n'
  };
  return cardHand
}

// Show the results of each player move
function showStatus () {
  if (!gameStarted) {
    dealertext.innerText = 'Welcome to BlackJack!'
    return
  }

  compareScores()

  fillTextFields()

  checkForEndOfGame()
}

function fillTextFields () {
  let dealerCardString = handAsString(dealerCards)
  let playerCardString = handAsString(playerCards)
  let playerCardString2 = handAsString(playerCards2)

  dealertext.innerText =
    'Dealer has:' + '\n' +
    dealerCardString +
    '(' + dealerScore + ')' + '\n\n'

  playertext.innerText =
    'Player has:' + '\n' +
    playerCardString +
    '(' + playerScore + ')' + '\n\n'

  if (splitHand === true) {
    playertext2.innerText =
    'Player has:' + '\n' +
    playerCardString2 +
    '(' + playerScore2 + ')' + '\n\n'
  }
}

// Scoring
function updateScores () {
  dealerScore = getScore(dealerCards)
  playerScore = getScore(playerCards)
  playerScore2 = getScore(playerCards2)
}

function getScore (cardArray) {
  let score = 0
  let hasAce = false
  for (i = 0; i < cardArray.length; i++) {
    let card = cardArray[i]
    score += getCardValue(card)
    if (card.value === '1') {
      hasAce = true
    }
  }
  if (hasAce && (score + 10) <= 21) {
    return score + 10
  }
  return score
}

function getCardValue (card) {
  switch (card.value) {
    case '9':
      return 9
    case '8':
      return 8
    case '7':
      return 7
    case '6':
      return 6
    case '5':
      return 5
    case '4':
      return 4
    case '3':
      return 3
    case '2':
      return 2
    case '1':
      return 1
    default:
      return 10
  }
}

// TODO What happens when it is a tie --> 'Stand-off',no winners
function compareScores () {
  updateScores()

  if (gameOver) {
    while (dealerScore <= playerScore &&
           dealerScore < 17 &&
           dealerCards.length < 5) {
      dealerCards.push(getNextCard())
      updateScores()
    }
  }

  if (playerScore === 21 || dealerScore > 21) {
    gameOver = true
    playerWon = true
  } else if (dealerScore === 21 || dealerCards.length === 5 || playerScore > 21) {
    gameOver = true
    playerWon = false
  } else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true
    }
  }
}

function checkForEndOfGame () {
  if (gameOver) {
    if (playerWon) {
      playertext.innerText += 'Player wins'
    } else {
      playertext.innerText += 'Game Over!! You suck'
    }
    newButton.style.display = 'inline'
    hitButton.style.display = 'none'
    stayButton.style.display = 'none'
  }
}

function checkForSplitOption () {
  if (playerCards.length === 2 && (playerCards[0].value === playerCards[1].value)) {
    splitButton.style.display = 'inline'
  }
}
