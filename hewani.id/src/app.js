// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
//const URL = "https://teachablemachine.withgoogle.com/models/-7vOVFy-s/";
const URL = "/my_model/";

let model, webcam, labelContainer, maxPredictions;

let isIos = false;
// fix when running demo in ios, video will be frozen;
if (window.navigator.userAgent.indexOf("iPhone") > -1 || window.navigator.userAgent.indexOf("iPad") > -1) {
  isIos = true;
}

// Load the image model and setup the webcam
async function init() {
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  const loader = document.querySelector(".loader");
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  btnStart.classList.add("d-none");
  btnStop.classList.remove("d-none");
  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  // model = await tmImage.load(modelURL, metadataURL);
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(600, 400, flip); // width, height, flip
  await webcam.setup({ facingMode: "environment" }); // request access to the webcam

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

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("p"));
  }

  webcam.play();
  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  let prediction;
  if (isIos) {
    prediction = await model.predict(webcam.webcam);
  } else {
    prediction = await model.predict(webcam.canvas);
  }
  // predict can take in an image, video or canvas html element
  // const prediction = await model.predict(webcam.canvas);
  const labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability.toFixed(2) > 0.7) {
      const persen = prediction[i].probability.toFixed(2) * 100;
      const classPrediction = `${prediction[i].className} :  ${persen}%`;
      labelContainer.childNodes[i].innerHTML = classPrediction;
      labelContainer.childNodes[i].classList.remove("hidden");
      labelContainer.childNodes[i].classList.add("text-center");
      labelContainer.childNodes[i].classList.add("label-hewan");
    } else {
      labelContainer.childNodes[i].classList.add("hidden");
      labelContainer.childNodes[i].classList.remove("text-center");
      labelContainer.childNodes[i].classList.remove("label-hewan");
      labelContainer.childNodes[i].innerHTML = "";
    }
  }
}

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

const navLink = document.querySelectorAll(".nav-link");
navLink.forEach((link) => {
  link.addEventListener("click", function () {
    navLink.forEach((link) => {
      link.classList.remove("active-link");
    });
    this.classList.add("active-link");
  });
});
