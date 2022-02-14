const URL_country =
  "https://gist.githubusercontent.com/erdem/8c7d26765831d0f9a8c62f02782ae00d/raw/248037cd701af0a4957cce340dabb0fd04e38f4c/countries.json";
const x =
  "https://api.openweathermap.org/data/2.5/onecall?lat=41.327545&lon=19.818699&exclude=alerts,current,daily&units=metric&appid=ec6006d2133c9501ecb82ea3e99d6760";

// let time = new Date(a.current.dt * 1000);  UTX time
// console.log(time.toLocaleString());//full time
// console.log(time.toLocaleString("en-US", {weekday: "long"})) // Monday
// console.log(time.toLocaleString("en-US", {month: "long"})) // December
// console.log(time.toLocaleString("en-US", {day: "numeric"})) // 9
// console.log(time.toLocaleString("en-US", {year: "numeric"})) // 2019
// console.log(time.toLocaleString("en-US", {hour: "numeric"})) // 10 AM
// console.log(time.toLocaleString("en-US", {minute: "numeric"})) // 30
// console.log(time.toLocaleString("en-US", {second: "numeric"})) // 15
// console.log(time.toLocaleString("en-US", {timeZoneName: "short"})) // 12/9/2019, 10:30:15 AM CST

const app = document.querySelector(".app");
const canvas = document.querySelector(".draw");
let ctx = canvas.getContext("2d");
let input = document.querySelector(".input");
input.value = "Tirana";
const container = document.querySelector(".container");
const bot_ele = document.querySelectorAll(".card");
const weather_data = document.querySelector(".weather_data");
const top_nav = document.querySelector(".top_nav");

let weather;
const cities = [];

// first call

fetch(URL_country)
  .then((res) => res.json())
  .then((data) => {
    cities.push(
      ...data.filter((el) => {
        return el.capital != null && el.capital != undefined;
      })
    );
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].capital == input.value) {
        weather = new Weather(cities[i].latlng[0], cities[i].latlng[1]);
        weather.handleData();
        break;
      }
    }
  });

function find(arr, name) {
  return arr.filter((place) => {
    const regex = new RegExp(name, "gi");
    return place.capital.match(regex);
  });
}

class Weather {
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.data;
    this.url = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.lon}&exclude=alerts,current,daily&units=metric&appid=ec6006d2133c9501ecb82ea3e99d6760`;
    this.time = [];
    this.weather = [];
    this.xpos;
    this.ypos;
  }
  handleData() {
    fetch(this.url)
      .then((res) => res.json())
      .then((res) => {
        this.data = res;
      })
      .then(() => {
        for (let i = 0; i < this.data.hourly.length - 24; i = i + 3) {
          this.time.push(
            new Date(
              this.data.hourly[i].dt * 1000 + this.data.timezone_offset * 1000
            )
          );
          this.weather.push(this.data.hourly[i]);
        }
      })
      .then(() => {
        weather.update();
        weather.show();
        weather.current(0);
      });
  }
  update() {
    for (let i = 0; i < this.time.length; i++) {
      bot_ele[i].querySelector("#houer").innerHTML = this.time[
        i
      ].toLocaleString("en-US", { weekday: "long" });
      bot_ele[i].querySelector("#min").innerHTML = `${this.time[
        i
      ].toLocaleString("en-US", { hour: "numeric" })}`;
      bot_ele[i]
        .querySelector("img")
        .setAttribute(
          "src",
          `http://openweathermap.org/img/wn/${this.weather[i].weather[0].icon}@2x.png`
        );
      top_nav
        .querySelectorAll("div")
        [i].querySelector("p").innerHTML = Math.floor(this.weather[i].temp);
      top_nav.querySelectorAll("div")[i].style.top = `${
        43 - (this.weather[i].temp * 7.3 - this.weather[i].temp)
      }px`;
    }
  }

  current(n) {
    weather_data
      .querySelector(".x")
      .querySelector(".day").innerHTML = `${this.time[n].toLocaleString(
      "en-US",
      { weekday: "long" }
    )}, ${this.time[n].toLocaleString("en-US", { hour: "numeric" })}`;
    weather_data
      .querySelector(".y")
      .querySelector(".day").innerHTML = this.weather[n].weather[0].description;
    weather_data
      .querySelector(".z")
      .querySelector("#a")
      .querySelector("img")
      .setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${this.weather[n].weather[0].icon}@2x.png`
      );
    weather_data
      .querySelector(".z")
      .querySelector("#b")
      .querySelector("#a").innerHTML = Math.floor(this.weather[n].temp);
  }

  show() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.1;
    ctx.strokeStyle = "rgba(0, 229, 255,0.9)";
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 465);
    ctx.lineTo(850, 465);
    ctx.stroke();

    ctx.font = "700 20px sans-serif";
    ctx.fillStyle = "rgba(0, 229, 255,0.9)";
    ctx.fillText("0", 20, 440);
    ctx.fillText("10", 20, 375);
    ctx.fillText("20", 20, 310);
    ctx.fillText("30", 20, 245);
    ctx.fillText("40", 20, 180);
    ctx.fillText("50", 20, 115);
    ctx.fillText("°C", 20, 50);

    ctx.beginPath();
    ctx.moveTo(50, 40);
    ctx.lineTo(42, 60);
    ctx.lineTo(58, 60);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(870, 465);
    ctx.lineTo(850, 457);
    ctx.lineTo(850, 473);
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i < this.weather.length; i++) {
      ctx.arc(
        i * 100 + (110 - i),
        435 - (this.weather[i].temp * 7.3 - this.weather[i].temp),
        6,
        0,
        Math.PI * 2,
        true
      );
      if (i < this.weather.length - 1) {
        ctx.moveTo(
          (i + 1) * 100 + (10 - (i + 1)),
          435 - (this.weather[i + 1].temp * 7.3 - this.weather[i + 1].temp)
        );
      }
    }
    ctx.fill();

    ctx.fillStyle = "rgba(0, 229, 255,0.2)";
    ctx.beginPath();
    ctx.moveTo(50, 465);
    ctx.lineTo(
      50,
      435 -
        (this.data.hourly[this.data.hourly.length - 1].temp * 7.3 -
          this.data.hourly[this.data.hourly.length - 1].temp)
    );
    for (let i = 0; i < this.weather.length; i++) {
      ctx.lineTo(
        i * 100 + (110 - i),
        435 - (this.weather[i].temp * 7.3 - this.weather[i].temp)
      );
    }
    ctx.lineTo(
      (this.weather.length - 1) * 100 + (110 - (this.weather.length - 1)) + 47,
      435 -
        (this.weather[this.weather.length - 1].temp * 7.3 -
          this.weather[this.weather.length - 1].temp)
    );
    ctx.stroke();
    ctx.lineTo(
      (this.weather.length - 1) * 100 + (110 - (this.weather.length - 1)) + 47,
      465
    );
    ctx.fill();
  }
}

function search() {
  const value = input.value;
  return cities.filter((capi) => {
    if (value.charAt(0).toUpperCase() + value.slice(1) == capi.capital) {
      input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
      weather = new Weather(capi.latlng[0], capi.latlng[1]);
      weather.handleData();
    }
  });
}

function inputvalue() {
  const found = find(cities, this.value);
  const html = found
    .map((place) => {
      const regex = new RegExp(this.value, "gi");
      const match = place.capital.replace(
        regex,
        `<div class="match">${this.value}</div>`
      );
      const capital = place.capital;
      return `
      <div class="div">${match}</div>
    `;
    })
    .join("");
  container.innerHTML = html;
}

input.addEventListener("focus", (e) => {
  container.style.opacity = 1;
  container.style.pointerEvents = "all";
});
input.onblur = function (e) {
  container.onmouseup = (e) => {
    let something = e.target.innerText;
    input.value = something;
    container.style.opacity = 0;
    container.style.pointerEvents = "none";
    search();
  };
};

input.addEventListener("change", inputvalue);
input.addEventListener("keyup", inputvalue);

function changeCurrent(n) {
  weather.current(n);
}