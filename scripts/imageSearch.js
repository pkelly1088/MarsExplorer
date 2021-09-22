'use strict';
//getting elements from dom to use
const submitBtn = document.querySelector('.search-button');
const roverField = document.querySelector('#rovers');
const dateField = document.querySelector('#selectDate');

//getting date and then breaking into pieces because months start at 0 and need to have 1 added to it to get the correct date from api
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const maxDate = `${year}-${month}-${day}`;

//empty array for use later
let roverJsonStore = [];

//when window loads set min and max of date selection form field so current day is the highest it can go and curiosity first day is min day
window.onload = dateField.setAttribute('max', `${maxDate}`);
window.onload = dateField.setAttribute('min', "2012-08-06");

//when a different rover is selected, then change the min and max to the date the rover was retrieving images
roverField.addEventListener('change', (event) => {
    console.log(maxDate);
    console.log(today);
    if (event.target.value === 'curiosity') {
        dateField.setAttribute('min', '2012-08-06');
        dateField.setAttribute('max', `${maxDate}`);
        console.log('curiosity');
    } else if (event.target.value === 'opportunity') {
        dateField.setAttribute('min', '2004-01-27');
        dateField.setAttribute('max', '2017-7-19');
        console.log('opportunity');
    } else if (event.target.value === 'spirit') {
        dateField.setAttribute('min', '2004-1-5');
        dateField.setAttribute('max', '2010-3-21');
        console.log('spirit');
        
    }
})

//start of accepting submit button
submitBtn.addEventListener('click', (e) => {
    //prevent page reload
    e.preventDefault();
    //get values from form fields
    let dateValue = dateField.value;
    let dateMax = dateField.getAttribute('max');
    let dateMin = dateField.getAttribute('min');
    let roverValue = roverField.value;

    //error handeling for date selection, add warning if date is empty or if date selected is outside rovers image range
    if (dateValue === '' || dateValue === null) {
        addWarning('Date field empty, please pick a date');
    } else if (dateValue > dateMax || dateValue < dateMin){
        addWarning(`Date must be between ${dateMin} and ${dateMax}`)
    } else {
        //if field values are good then fetch images from api
        fetchImages();
    }

    //fetch for getting rover images
    function fetchImages () {
        //url takes rover and date selected by user
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverValue}/photos?earth_date=${dateValue}&api_key=Pe5vzRz7yeje2Uwm5SZK7Yo5WxrEg4WcKoHmeICr`;
        const imageSection = document.querySelector('.rover-images');

        fetch(url)
        .then(res => {
            //if a bad response, then add error to let user know there is an error retrieving images, can be tested by changing api key
            if (res.status !== 200){
                reportError('Error retrieving images, Please try again.');
            } else if (res.status === 200) {
               return res.json();
            }
        })
        .then(data => {
            //if there are no photos on that day inform user
            if(data.photos.length === 0){
                reportError('No pictures found, try a different date');
            } else if (data.photos.length !== 0) {
                //if photos are returned, then render them on the page
                renderPhotos(data.photos);
            }
        })
        .catch(error => {
            console.log(error);
        })

        //function for adding error message to end of field label if there is a problem, add focus to field so user knows where
        function reportError (phrase) {
            if(document.body.contains(document.querySelector('.error'))){
                let informPara = document.querySelector('.error');
                informPara.remove();
            }
            dateField.focus();
            let para = document.createElement('p');
            let content = document.createTextNode(phrase);
            para.appendChild(content);
            para.classList.add('error');
            imageSection.prepend(para);
        }

        //to render photos cycle through array returned from fetch, place info from each object into a card to be displayed
        function renderPhotos(photoArray) {
            const imageSection = document.querySelector('.rover-images');
            imageSection.innerHTML = '';
            for(let i = 0; i < 12; i++) {
                let photoCard = `<div class="card">
                <div class="card-container" id="card_${i}" aria-describedby="image_card">
                    <img src="${photoArray[i].img_src}" id="image_${i}" alt=" Photo from Rover${photoArray[i].rover.name} from camera"${photoArray[i].camera.full_name}" on date ${photoArray[i].earth_date}>
                    <div class="image-text">
                        <h3 id="name_${i}" data-value="${photoArray[i].rover.name}">Rover: ${photoArray[i].rover.name}</h3>
                        <h4 id="camera_${i}" data-value="${photoArray[i].camera.full_name}">Camera: ${photoArray[i].camera.full_name}</h4>
                        <p id="earth_${i}" data-value="${photoArray[i].earth_date}">Earth Date: ${photoArray[i].earth_date}</p>
                        <p id="sol_${i}" data-value="${photoArray[i].sol}">Mars Date: Sol ${photoArray[i].sol}</p>
                        <button class="likeBtn" id="like_${i}" data-id="${photoArray[i].id}">Like Photo</button>
                    </div>
                </div>
            </div>`;

            //images being added to image section on page
            imageSection.innerHTML += photoCard;
            //once images are on page add functionality to like button
            addLike();
            }
        }
    }

    //function for adding warning to label of date field if there is a problem,
    function addWarning (phrase) {
        //checks to see if error message is already displayed, but then removes it if it does
        if(document.body.contains(document.querySelector('.inform'))){
            let informPara = document.querySelector('.inform');
            informPara.remove();
        }
        //add focus to field and then add error message behind label
        dateField.focus();
        const dateLabel = document.querySelector('.date-label');
        let para = document.createElement('span');
        let content = document.createTextNode(phrase);
        para.appendChild(content);
        para.classList.add('inform');
        dateLabel.appendChild(para);

        //when user acknowledges error and selects the date field again the error message is removed
        dateField.addEventListener('click', () =>{
            let informPara = document.querySelector('.inform');
            informPara.remove(); 
        })
    }

    //function for like button functionality
    function addLike () {
        //get all like buttons
        const likeBtn = document.querySelectorAll('.likeBtn');

        //for each like button in like button list
        for (let i = 0; i < likeBtn.length; i++) {
            //add an event listener
            likeBtn[i].addEventListener("click", () => {
                //get data from that card
                let roverName = document.querySelector(`#name_${i}`).dataset.value;
                let roverImg = document.querySelector(`#image_${i}`).src;
                let roverCamera = document.querySelector(`#camera_${i}`).dataset.value;
                let roverEarth = document.querySelector(`#earth_${i}`).dataset.value;
                let roverMars = document.querySelector(`#sol_${i}`).dataset.value;
                let likeBtnSingle = document.querySelector(`#like_${i}`);
                let roverId = document.querySelector(`#like_${i}`).dataset.id;

                //save info to object to save in local storage
                let roverObject = {
                    id: roverId,
                    name: roverName,
                    image: roverImg,
                    camera: roverCamera,
                    date: roverEarth,
                    sol: roverMars
                };
                
                //if button is already liked, remove like class, change button text, get existing string of liked objects parse to array of objects, if object id is in local storage, them remove from array and save new array to local storage as string
                if (likeBtnSingle.classList.contains('liked') === true) {
                    likeBtnSingle.classList.remove('liked');
                    likeBtnSingle.innerHTML = 'Like Photo';
                    roverJsonStore = JSON.parse(localStorage.getItem('likedRoverList'));
                    roverJsonStore.forEach(function(el, index){
                        let elId = el.id;
                        if (elId === roverId) {
                            roverJsonStore.splice(index, 1);
                            localStorage.setItem('likedRoverList', JSON.stringify(roverJsonStore));
                        }
                    })

                    //if button does not have like class, then add it, change button text
                } else if (likeBtnSingle.classList.contains('liked') === false) {
                    likeBtnSingle.classList.add('liked');
                    likeBtnSingle.innerHTML = 'Remove Like';
                    //if local storage doesn't exist, then push object to array and initial local storage with new array as string
                    if (localStorage.hasOwnProperty('likedRoverList') === false) {
                        roverJsonStore.push(roverObject);
                        localStorage.setItem('likedRoverList', JSON.stringify(roverJsonStore));
                    //if local storage does exist, then retrieve local storage, add new object to array and save to local storage as string
                    } else if (localStorage.hasOwnProperty('likedRoverList') === true) {
                        let altJsonStore = JSON.parse(localStorage.getItem('likedRoverList'));
                        altJsonStore.push(roverObject);
                        localStorage.setItem('likedRoverList', JSON.stringify(altJsonStore));
                    }
                }
            });
        }
    }
})