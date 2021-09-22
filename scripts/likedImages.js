'use strict';

//when page loads display images saved to local storage
window.onload = displayLikedPhotos();

//function for displaying liked photos
function displayLikedPhotos () {

    //empty array for use later
    let roverJsonStore = [];

    //if local storage has likedRoverList, then display on page
    if(localStorage.hasOwnProperty('likedRoverList') === true) {
        //save local storage
        let roverArray = JSON.parse(localStorage.getItem('likedRoverList'));

        //grab section on page for images
        const imageSection = document.querySelector('.images-liked');
        //clears page if anything is there
        imageSection.innerHTML = '';
        //iterages over stored images and added them to cards, then adds them to the page
            for(let i = 0; i < 12; i++) {
                let photoCard = `<div class="card">
                <div class="card-container" id="card_${i}" aria-describedby="image_card">
                    <img src="${roverArray[i].image}" id="image_${i}" alt=" Photo from Rover${roverArray[i].name} from camera"${roverArray[i].camera}" on date ${roverArray[i].date}>
                    <div class="image-text">
                        <h3 id="name_${i}" data-value="${roverArray[i].name}">Rover: ${roverArray[i].name}</h3>
                        <h4 id="camera_${i}" data-value="${roverArray[i].camera}">Camera: ${roverArray[i].camera}</h4>
                        <p id="earth_${i}" data-value="${roverArray[i].date}">Earth Date: ${roverArray[i].date}</p>
                        <p id="sol_${i}" data-value="${roverArray[i].sol}">Mars Date: Sol ${roverArray[i].sol}</p>
                        <button class="likeBtn liked" id="like_${i}" data-id="${roverArray[i].id}">Remove Like</button>
                    </div>
                </div>
            </div>`;

            imageSection.innerHTML += photoCard;
            //adds like functionality
            addLike();
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
                            likeBtnSingle.innerHTML = 'Like Photo'
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
                        displayLikedPhotos();
                    });
                }
            }
    }
}