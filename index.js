/* Esercizio 1
Utilizzando try/catch,  async/await e fetch,
definire una funzione per ottenere
le città tramite l'url "https://api.musement.com/api/v3/cities"
Gestire l'errore con throw.
In caso di errore far apparire un banner rosso
con la scritta "Ops, c'è stato un errore"

Nota: per forzare un errore basta scrivere in modo errato l'url  del fetch

 */

const mainWrapper = document.querySelector('.main__wrapper')

async function loadCities() {
  try {
    const response = await fetch('https://api.musement.com/api/v3/cis')
    const result = await response.json()
    if (!response.ok) {
      throw errorMessage
    }
    console.log(result)
  } catch (errorMessage) {
    console.log('catch di loadCities', errorMessage)
    const errorBanner = document.createElement('div')
    errorBanner.textContent = "Ops, c'è stato un'errore"
    errorBanner.classList.add('errorBanner')
    mainWrapper.appendChild(errorBanner)
  }
}

loadCities()

/*  Esercizio 2 
 Impostate o stato interno della nostra applicazione
 con una chiave 'config', nel quale tenere
 salvati i dati utili per effettuare le chiamate con Fetch di MovieDB.
 Creare una funzione utility che passato un path come parametro ritorni
 la url
 completa da utilizzare.
 Aggiungere un'altra chiave allo state dell'applicativo
 chiamata 'movies'
 Eseguire una chiamata al DOMContentLoaded della pagina 
 che carichi i film più popolari
 (utilizzare sempre try/catch, async/await, throw e fetch)
 e che li salvi nello stato sotto 'movies' e poi stampi
 in console il risultato.
 Con l'errore visualizzare il banner dell'esercizio 1.
 */

const state = {
  config: {
    api_key: '4efd416bce1421bc186bc4d7599fbd04',
    base_url: 'https://api.themoviedb.org/3',
  },
  movies: null,
  guest_session: null,
}

function getUrl(pathName) {
  return `${state.config.base_url}${pathName}?api_key=${state.config.api_key}`
}

async function getMoviePopular() {
  const moviesPopularPathName = '/movie/popular'

  // abbiamo creato la url completa

  const popularMoviesData = getUrl(moviesPopularPathName)

  try {
    const response = await fetch(popularMoviesData)
    const result = await response.json()
    state.movies = result
    console.log(state)
    if (!response.ok) {
      throw result
    }
  } catch (errorMessage) {
    console.log(errorMessage)
    const errorBanner = document.createElement('div')
    errorBanner.textContent = "Ops, c'è stato un'errore"
    errorBanner.classList.add('errorBanner')
    mainWrapper.appendChild(errorBanner)
  }
}

document.addEventListener('DOMContentLoaded', getMoviePopular)

/*  Esercizio 3
 Prendere confidenza con localStorage.
 Utilizzare i metodi setItem, getItem
 e removeItem per fare un pò di pratica.

 Esercizio suggerito:
 nel'HTML un input e due bottoni
 rispettivamente "salva" e "rimuovi"

 Al DOMContentLoaded della pagina stampare
  in console il valore della chiave "test_storage"
  presente nel localStorage se è presente.

  Al click di "salva" salvare nel localStorage il valore dell'input
  sotto la chiave "test_storage"
  Al click di "rimuovi" eliminare la chiave "test_storage"
  dal localStorage
 
  Una volta aggiunto il valore con salva, chiudere
  e riaprire il browser.
  Dovrebbe apparire in console il valore aggiunto precedentemente.
 */

const saveLocalStorBTN = document.querySelector('button[name="saveLSbtn"]')
const deleteLocalStorBTN = document.querySelector('button[name="deleteLSbtn"]')

function saveOnLocalStor() {
  localStorage.setItem('test_storage', 'hi, im value!')
}
function deleteOnLocalStor() {
  localStorage.removeItem('test_storage')
}

function printTest_storage() {
  const test_storageKey = localStorage.getItem('test_storage')
  console.log(test_storageKey)
}

saveLocalStorBTN.addEventListener('click', saveOnLocalStor)
deleteLocalStorBTN.addEventListener('click', deleteOnLocalStor)
document.addEventListener('DOMContentLoaded', printTest_storage)

/*   L'esercizio 4 non è completo ma avevo intrapreso una strada! :D  */

/*  Esercizio 4
   
Al DOMContentLoaded verificare che esista un movieDB session_id.
Se non è presente crearlo con *questa API* ed aggiungerlo al localStorage
Invece di aggiungere solo il session_id aggiungere
un oggetto trasformato in stringa che contenga anche l'expires date.

Fare un refactor della funzione iniziale di verifica,
che oltre a controllare che esista, si assicuri anche che non sia scaduto.
//  */

async function getSession_id() {
  const sessionGuestURL = '/authentication/guest_session/new'
  const sessionGuestcomplete = getUrl(sessionGuestURL)
  try {
    const response = await fetch(sessionGuestcomplete)
    const result = await response.json()
    state.guest_session = result
    console.log(state)
    console.log(result)
    localStorage.getItem('session_id')
    const session_idOBJ = result
    // const session_idValues = JSON.stringify(session_idOBJ)

    const session_idValues = `${session_idOBJ.guest_session_id}&${session_idOBJ.expires_at}`
    localStorage.setItem('session_id', session_idValues)

    if (!response.ok) {
      throw errorMessage
    }
  } catch (errorMessage) {
    console.log(errorMessage)
    const errorBanner = document.createElement('div')
    errorBanner.textContent = "Ops, c'è stato un'errore"
    errorBanner.classList.add('errorBanner')
    mainWrapper.appendChild(errorBanner)
  }
}

// mi prendo il value di session_id, quello che mi interessa è expires_at
const expiresAtString = localStorage.getItem('session_id')
console.log(expiresAtString)
const onlyexpires = expiresAtString.split('&')
const expirationDate = onlyexpires[1]
console.log(typeof expirationDate)

// mi creo una funzione per estrapolare i dati che mi interessano dalla string Expires_at
function splitExpires(expDate) {
  expDate = {
    year: null,
    month: null,
    day: null,
    hours: null,
    minutes: null,
    seconds: null,
  }
  //  2021-02-09 16:21:22
  expDate.year = expirationDate.slice(0, 4)
  expDate.month = expirationDate.slice(5, 7)
  expDate.day = expirationDate.slice(8, 10)
  expDate.hours = expirationDate.slice(11, 13)
  expDate.minutes = expirationDate.slice(14, 16)
  expDate.seconds = expirationDate.slice(17, 19)

  return expDate
}

document.addEventListener('DOMContentLoaded', getSession_id)

//funzione per controllare se esiste una session_id e controlla anche la scadenza

async function isSession_id(errorMex) {
  const stringObjExpires = splitExpires(expirationDate)

  const realDate = new Date(
    stringObjExpires.year,
    stringObjExpires.month,
    stringObjExpires.day,
    stringObjExpires.hours,
    stringObjExpires.minutes,
    stringObjExpires.seconds
  )
  console.log(realDate)

  new Date(year, month, day, hours)

  try {
    if (localStorage.getItem('session_id')) {
      console.log('Guest session exists! Yahoo!')
      const expiresHoursNow = new Date()
      if (!(stringObjExpires.hours === expiresHoursNow.getHours())) {
        // this checks if you are still in the same guest Session!
      }
    } else {
      throw errorMex
    }
  } catch (errorMex) {
    console.log(errorMex)
  }
}

document.addEventListener('DOMContentLoaded', isSession_id)
