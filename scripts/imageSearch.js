'use strict';
const submitBtn = document.querySelector('.search-button');
const roverField = document.querySelector('#rovers');
const dateField = document.querySelector('#selectDate');

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const maxDate = `${year}-${month}-${day}`;

let roverJsonStore = [];

window.onload = dateField.setAttribute('max', `${maxDate}`);
window.onload = dateField.setAttribute('min', "2012-08-06");

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

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let dateValue = dateField.value;
    let dateMax = dateField.getAttribute('max');
    let dateMin = dateField.getAttribute('min');
    let roverValue = roverField.value;

    if (dateValue === '' || dateValue === null) {
        addWarning('Date field empty, please pick a date');
    } else if (dateValue > dateMax || dateValue < dateMin){
        addWarning(`Date must be between ${dateMin} and ${dateMax}`)
    } else {
        fetchImages();
    }

    function fetchImages () {
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${roverValue}/photos?earth_date=${dateValue}&api_key=Pe5vzRz7yeje2Uwm5SZK7Yo5WxrEg4WcKoHmeICr`;
        const imageSection = document.querySelector('.rover-images');

        fetch(url)
        .then(res => {
            if (res.status !== 200){
                reportError('Error retrieving images, Please try again.');
            } else if (res.status === 200) {
               return res.json();
            }
        })
        .then(data => {
            if(data.photos.length === 0){
                reportError('No pictures found, try a different date');
            } else if (data.photos.length !== 0) {
                renderPhotos(data.photos);
            }
        })

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

            imageSection.innerHTML += photoCard;
            addLike();
            }
        }
    }

    function addWarning (phrase) {
        if(document.body.contains(document.querySelector('.inform'))){
            let informPara = document.querySelector('.inform');
            informPara.remove();
        }
        dateField.focus();
        const dateLabel = document.querySelector('.date-label');
        let para = document.createElement('span');
        let content = document.createTextNode(phrase);
        para.appendChild(content);
        para.classList.add('inform');
        dateLabel.appendChild(para);

        dateField.addEventListener('click', () =>{
            let informPara = document.querySelector('.inform');
            informPara.remove(); 
        })
    }

    function addLike () {
        const likeBtn = document.querySelectorAll('.likeBtn');

        for (let i = 0; i < likeBtn.length; i++) {
            likeBtn[i].addEventListener("click", () => {
                let roverName = document.querySelector(`#name_${i}`).dataset.value;
                let roverImg = document.querySelector(`#image_${i}`).src;
                let roverCamera = document.querySelector(`#camera_${i}`).dataset.value;
                let roverEarth = document.querySelector(`#earth_${i}`).dataset.value;
                let roverMars = document.querySelector(`#sol_${i}`).dataset.value;
                let likeBtnSingle = document.querySelector(`#like_${i}`);
                let roverId = document.querySelector(`#like_${i}`).dataset.id;

                let roverObject = {
                    id: roverId,
                    name: roverName,
                    image: roverImg,
                    camera: roverCamera,
                    date: roverEarth,
                    sol: roverMars
                };
                
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
                } else if (likeBtnSingle.classList.contains('liked') === false) {
                    likeBtnSingle.classList.add('liked');
                    likeBtnSingle.innerHTML = 'Remove Like';
                    if (localStorage.hasOwnProperty('likedRoverList') === false) {
                        roverJsonStore.push(roverObject);
                        localStorage.setItem('likedRoverList', JSON.stringify(roverJsonStore));
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