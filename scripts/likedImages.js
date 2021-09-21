'use strict';

window.onload = displayLikedPhotos();

function displayLikedPhotos () {

    let roverJsonStore = [];

    if(localStorage.hasOwnProperty('likedRoverList') === true) {
        let roverArray = JSON.parse(localStorage.getItem('likedRoverList'));
        console.log(roverArray);

        const imageSection = document.querySelector('.images-liked');
        imageSection.innerHTML = '';
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
            addLike();
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
                            likeBtnSingle.innerHTML = 'Like Photo'
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
                        displayLikedPhotos();
                    });
                }
            }
    }
}