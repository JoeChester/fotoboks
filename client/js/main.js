// Grab elements, create settings, etc.
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var video = document.getElementById('video');
var buffer = document.getElementById('buffer');
var bufferContext = buffer.getContext('2d');
var opacity = 0;
var galleryItems = [];


var isBusy = false;

// Camera Live Preview
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

// Buzzer Handler
document.addEventListener("keydown", function(event) {
  if(event.which == 66){
    snapshot();
  };
});

function getAppInfo(){
  $.ajax({
    type: "GET",
    url: "info",
  }).done(function(info) {
    $("#version").html(info.version);
    $("#appAuthor").html(info.appAuthor);
    $("#savepath").html(info.savepath);
    var usb = "No";
    if(info.detectedUsb){
        usb = "Yes";
    }
    $("#detectedUsb").html(usb);
    setTimeout(function(){
    	$("#info").addClass("hidden");
    }, 5000)
  });
}

$(function() {
  getAppInfo();
  getGallery();
});

// Fade-In Preparation
function resetWhite(){
  ctx.beginPath();
  ctx.rect(0, 0, 960, 720);
  ctx.fillStyle = "white";
  ctx.fill();
}

// Actual Preview White Fade-In Effect
function fadeIn() {
  ctx.globalAlpha = opacity;
  ctx.drawImage(buffer, 0, 0, 960, 720);
  opacity += 0.02;
  if (opacity < 1)
      requestAnimationFrame(fadeIn);
  else
      isBusy = false;
}

// POST to PHP saver script (ul.php)
function saveToServer(){
  var dataURL = canvas.toDataURL();

  $.ajax({
    type: "POST",
    url: "ul",
    data: {
      imgBase64: dataURL
    }
  }).done(function(o) {
    console.log('saved');
    getGallery();
  });
}

// Actual Snapshot Function
function snapshot(){

  if (isBusy){
    return;
  }
  isBusy = true;

  // Display White Flash, let it light for a bit before taking picture
  $("#flash").addClass("flashColor");
  setTimeout(function(){
    bufferContext.drawImage(video, 0, 0, 960, 720);

    // Deactivate Flash again
    $("#flash").removeClass("flashColor");

    // Picture Fade-In Effect
    $("#video").addClass("hidden")
    resetWhite();
    opacity = 0;
    fadeIn();

    setTimeout(function() {
      saveToServer();
      $("#video").removeClass("hidden");
    }, 2000);

  }, 900)


}

function getGallery(){
  $.ajax({
    type: "GET",
    url: "gallery",
  }).done(function(galleryItems) {
    for(var i in galleryItems){
      if(galleryItems[i] != null && galleryItems[i] != undefined){
        $("#galleryItem" + i).attr("src", galleryItems[i]);
      }
    }
  });
  // Always also refresh the count
  getCount();
}

function getCount(){
  $.ajax({
    type: "GET",
    url: "num",
  }).done(function(num) {
    $("#fileCount").html(num);
  });
}