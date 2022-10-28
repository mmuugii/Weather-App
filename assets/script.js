$(document).ready(function () {
const form = document.querySelector('.upper-banner form');
const input = document.querySelector('.upper-banner input');
const msg = document.querySelector('.upper-banner .msg');
const list = document.querySelector('.input-section .cities');

const apiKey = 'f5ae7c1a323bcf922d47c9c63d2ab9c8';

let cities = [];

form.addEventListener('submit', e => {
    e.preventDefault();
    const inputVal = input.value;
    cities.push(inputVal);
    localStorage.setItem("city", JSON.stringify(cities));

    const listItems = list.querySelectorAll('.input-section .city');
    const listItemsArray = Array.from(listItems);
// Logic for making sure that city is correctly entered
    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = "";
            
            if (inputVal.includes(",")) {
                
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                        .querySelector(".city-name span")
                        .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            } else {
                
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });

        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city-name span").textContent
                } ..otherwise be more specific by providing the country as well`;
            form.reset();
            input.focus();
            return;
        }
    }

// Fetching the API Call
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]
                }.svg`;
            const li = document.createElement('li');
            li.classList.add('city');
            const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                    <span>${name}</span>
                    <sup>${sys.country}</sup>
                </h2>
                <div>Date: ${(new Date(data.dt * 1000).toLocaleDateString("en-US"))}</div>
                <div class="city-temp">${Math.round(main.temp)}<sup> °F</sup></div>
                <div>Humidity: ${Math.round(main.humidity)}<sup> °F</sup></div>
                <div>Wind Speed: ${data.wind.speed}<sup> mph</sup></div>
                <figure>
                    <img class="city-icon" src="${icon}" alt="${weather[0]["description"]
                }">
                    <figcaption>${weather[0]["description"]}</figcaption>
                </figure>
            `;
            console.log(data);
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = "Please enter valid city name";
        });
    msg.textContent = '';
    form.reset();
    input.focus();
});

// code block for making the save button work to actually save the value field into local storage.
    // $("#submitBtn").on("click", function () {
    //     var city = inputVal;
    //     var value = $(this).siblings(".cities").val();
    //     localStorage.setItem(city, value);
    // });
});

