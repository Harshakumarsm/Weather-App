const cityInput=document.querySelector(".city-input");
const searchBtn=document.querySelector(".search-btn");

const notFoundSection=document.querySelector(".not-found");
const searchFoundSection=document.querySelector(".search-city");
const weatherInfoSection=document.querySelector(".weather-info");

const countryTxt=document.querySelector(".country-txt");
const tempTxt=document.querySelector(".temp-text");
const conditionTxt=document.querySelector(".condition-txt");
const humidityTxt=document.querySelector(".humidity-value-txt");
const windTxt=document.querySelector(".wind-value-txt");
const weatherSummaryImg=document.querySelector(".weather-summary-img");
const currDateTxt=document.querySelector(".current-date-txt");


const forecastItemsContainer= document.querySelector('.forecast-item-container');
const apiKey='e58d8ab3aface1a0aaaf57d8e1a9dbc5';
searchBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim()!=''){
        updateWeatherinfo(cityInput.value)
        cityInput.value='';
        cityInput.blur();   
    }
})

cityInput.addEventListener("keydown",(event)=>{
    if(event.key==='Enter' && cityInput.value.trim()!='' ){
        updateWeatherinfo(cityInput.value)
        cityInput.value='';
        cityInput.blur();   
    }
})

function showDisplaySection(section){
[weatherInfoSection,searchFoundSection,notFoundSection].forEach(section=> section.style.display='none')
section.style.display='flex';
}

function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg'
    else if(id<=321) return 'drizzle.svg'
    else if(id<=531) return 'rain.svg'
    else if(id<=622) return 'snow.svg'
    else if(id<=781) return 'clear.svg'
    else return 'clouds.svg'
    
}

function getCurrentDate(){
    const currentdate=new Date();
    // console.log(currentdate);
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    return  currentdate.toLocaleDateString('en-US', options);
}

async function getFetchData(endPoint, city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const apiResponse= await fetch(apiUrl);

    return apiResponse.json();
}

async function updateWeatherinfo(city){
    
    const weatherdata= await getFetchData('weather',city)
    if(weatherdata.cod != 200){
        showDisplaySection(notFoundSection);
        return
    }

    console.log(weatherdata);

    const {
        name:country,
        main:{temp,humidity},
        weather:[{id, main}],
        wind:{speed}
    }= weatherdata

    countryTxt.textContent=country;
    tempTxt.textContent= Math.round(temp)+' °C'
    conditionTxt.textContent= main;
    humidityTxt.textContent=humidity+' %';
    windTxt.textContent= Math.round(speed*(3.6))+' kph';
    weatherSummaryImg.src=`assets/weather/${getWeatherIcon(id)}`;
    currDateTxt.textContent=getCurrentDate();
    await updateForecastInfo(city)
   showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city){
    const forecastData= await getFetchData('forecast',city);


    const timetaken='12:00:00'
    const  todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML='';
    forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timetaken) && 
            !forecastWeather.dt_txt.includes(todayDate))
            {
                console.log(forecastWeather);
                
                updateForecastItems(forecastWeather)
            }
    })
}

function updateForecastItems(weatherData){
    const {
        dt_txt:date,
        weather:[{ id }],
        main:{temp}
    } = weatherData;
    const forecastDate=new Date(date);
    const dateOptions = {
        day: '2-digit',
        month: 'short',
    };

    // Get the formatted date result
    const dateResult = forecastDate.toLocaleDateString('en-US', dateOptions)

    const forecastItem = `
                <div class="forecast-item">
                    <div class="forecast-item-date regular-txt">${dateResult}</div>
                    <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                </div>
                `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}