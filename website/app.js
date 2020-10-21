/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
// Rearranged order to match my local format & added 1 to month value to get the correct month
let newDate = d.getDate()+'/'+( d.getMonth()+1)+'/'+ d.getFullYear();

// baseHTML & API key for OpenWeatherMap API:
let baseURL = 'http://api.openweathermap.org/data/2.5/forecast?zip=';
let apiKey = '&units=metric&appid=8ce6324601ec5b4eb8e4ebe05f5e67ee';// adding (&units=metric) to get temp in my local units

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
    const theZip =  document.getElementById('zip').value;
    const feel =  document.getElementById('feelings').value;
    
    
    //creating result animation on button click and looping it
    const element = document.querySelector('.holder.entry');
    e.preventDefault;
    element.classList.remove("active");
    void element.offsetWidth;
    element.classList.add("active");

// validating the zip code is made of 5 digits using regular expression
const zipCodeCheck = /^\d{5}$/;    
    if (!(zipCodeCheck.test(theZip))){
      document.getElementById('date').innerHTML = '<h3 style="color:red; text-align: center;">Please enter a valid zip code of 5 digits<p>&#128526</h3>';
      document.getElementById('temp').innerHTML = '';
      document.getElementById('content').innerHTML = '';
    } else {
        getData(baseURL,theZip, apiKey)
    
    .then(function(data) {
        if(data.cod==="404"){
            document.getElementById('date').innerHTML = '<h3 style="color:red; text-align: center;">City not Found &#128542</h3>';
            document.getElementById('temp').innerHTML = '';
            document.getElementById('content').innerHTML = '';
    } else {

        console.log(data);
//getting desired data --> date, temp, feel, city name
        postData('/addData', {date:newDate, temp:data.list[0].main.temp, content:feel, city:data.city.name, cod:data.cod});
        updateUI();
    }
    });}
    
}
//Constracting the link to get the data from the api
const getData = async (baseURL, zip, key)=>{
    
    const res = await fetch(baseURL+zip+key);
    try {
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.log('error', error);
    }
};

const postData = async ( url = '', data = {})=>{

    console.log(data);
    const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),       
  });

    try {
      const newData = await response.json();
      console.log(newData);       
      return newData;
    }
    catch(error) {
    console.log("error", error);
    }
};

//Updating the HTML content with the data obtained from the api
const updateUI = async () => {
    const request = await fetch('/allData');
    //making alternative if feeling's value is empty
    if(document.getElementById('feelings').value===""){
    try{
        const allData = await request.json();
        document.getElementById('date').innerHTML = `Today is ${allData[0].date}`;
        document.getElementById('temp').innerHTML = `Temperature in ${allData[0].city} is ${allData[0].temp.toFixed(1)} \xB0C`;  // adding degree sign
        document.getElementById('content').innerHTML = `<p style="text-align: center; font-size: 30px;">&#x1F60A`;
    }
    catch(error){
        console.log('error', error);
    }
} else {
    try{
        const allData = await request.json();
        document.getElementById('date').innerHTML = `Today is ${allData[0].date}`;
        document.getElementById('temp').innerHTML = `Temperature in ${allData[0].city} is ${allData[0].temp.toFixed(1)} \xB0C`;  // adding degree sign
        document.getElementById('content').innerHTML = `and you feel ${allData[0].content}<p style="text-align: center; font-size: 30px;">&#x1F60A`;
    }
    catch(error){
        console.log('error', error);
    }
}};