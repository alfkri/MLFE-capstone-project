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

// Define variable
let model, webcam, labelContainer, maxPredictions;

// Model URL
// const URL = "my_model/";
const URL = "https://teachablemachine.withgoogle.com/models/-7vOVFy-s/";


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
  await webcam.setup({ facingMode: "environment" }); // request access to the webcam


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
  prediction = await model.predict(webcam.canvas);
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