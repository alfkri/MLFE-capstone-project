// Welcome alert
function showAlert() {
  Swal.fire({
    title: 'Selamat Datang di Hewani.id 😄',
    imageUrl: './asset/img-alert.gif',
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'bg',
  })
}
showAlert();


// Define variable
let model, webcam, labelContainer, maxPredictions;

// Model URL
const URL = "my_model/";
// const URL = "https://teachablemachine.withgoogle.com/models/-7vOVFy-s/";

// Setting ios
let isIos = false;
if (window.navigator.userAgent.indexOf("iPhone") > -1 || window.navigator.userAgent.indexOf("iPad") > -1) {
  isIos = true;
}

// Load the image model and setup the webcam
async function init() {
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  btnStart.classList.add("d-none");
  btnStop.classList.remove("d-none");

  // load the model and metadata
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Setup a webcam
  const flip = false; // whether to flip the webcam
  webcam = new tmImage.Webcam(600, 400, flip); // width, height, flip
  await webcam.setup({ facingMode: "user" }); // request access to the webcam

  // ios config
  if (isIos) {
    document.getElementById("webcam-container").appendChild(webcam.webcam); // webcam object needs to be added in any case to make this work on iOS
    // grab video-object in any way you want and set the attributes
    const webCamVideo = document.getElementsByTagName("video")[0];
    webCamVideo.setAttribute("playsinline", true); // written with "setAttribute" bc. iOS buggs otherwise
    webCamVideo.muted = "true";
    webCamVideo.style.width = width + "px";
    webCamVideo.style.height = height + "px";
  } else {
    document.getElementById("webcam-container").appendChild(webcam.canvas);
  }


  // Append elements to the DOM and class labels
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("p"));
  }


  webcam.play();
  window.requestAnimationFrame(loop);
}

// Looping for update the webcam frame
async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

// Make a prediction and append to the DOM
async function predict() {
  let prediction;
  if (isIos) {
    prediction = await model.predict(webcam.webcam);
  } else {
    prediction = await model.predict(webcam.canvas);
  }
  const labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability.toFixed(2) > 0.7) {
      const classPrediction = `${prediction[i].className}`;
      labelContainer.childNodes[i].innerHTML = classPrediction;
      labelContainer.childNodes[i].classList.remove("d-none");
      labelContainer.childNodes[i].classList.add("text-center");
      labelContainer.childNodes[i].classList.add("label-hewan");
    } else {
      labelContainer.childNodes[i].classList.add("d-none");
      labelContainer.childNodes[i].classList.remove("text-center");
      labelContainer.childNodes[i].classList.remove("label-hewan");
      labelContainer.childNodes[i].innerHTML = "";
    }
  }
}

// Stop prediction
function stop() {
  webcam.stop();
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  btnStart.classList.remove("d-none");
  btnStop.classList.add("d-none");
  const canvas = document.getElementsByTagName("canvas")[0];
  const labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "";
  canvas.remove();
}

// Navbar active link
const navLink = document.querySelectorAll(".nav-link");
navLink.forEach((link) => {
  link.addEventListener("click", function () {
    navLink.forEach((link) => {
      link.classList.remove("active-link");
    });
    this.classList.add("active-link");
  });
});

// Event listener for start and stop button
document.getElementById("btn-start").addEventListener("click", init);
document.getElementById("btn-stop").addEventListener("click", stop);
