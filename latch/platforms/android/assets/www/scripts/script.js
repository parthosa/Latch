//$(document).ready(function () {
//
//<<<<<<< HEAD
//  $(document).on('click', function (ev) {
//    console.log((ev.target).closest('#moreOptionsTrigger') != null)
//    var bx = document.getElementById('moreOptions');
//
//    if (bx != null) {
//      if ((ev.target).closest('#moreOptionsTrigger') != null)
//        bx.style.display = 'block'
//=======
//	$(document).on('click',function(ev){
//		var bx=document.getElementById('moreOptions');
//>>>>>>> 775b31d52bed9911216bacfb294cc40c1d9d45f5
//
//      else if ((ev.target).closest('#moreOptions') == null)
//        bx.style.display = 'none'
//
//    }
//  })
//});

$(document).ready(function () {
  Materialize.updateTextFields();
});


var dataURL;


function previewFile(canvasId) { 
  var preview = document.querySelector('img#img-preview'); 
  var file   = document.querySelector('input#profile-pic-upload').files[0]; 
  var reader  = new FileReader();
  //        console.log(2)

  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext("2d");

  img = new Image();
  img.onload = function () {

    canvas.height = canvas.width * (img.height / img.width);

    /// step 1
    var oc = document.createElement('canvas'),
      octx = oc.getContext('2d');

    oc.width = img.width * 0.5;
    oc.height = img.height * 0.5;
    octx.drawImage(img, 0, 0, 250, 250);

    /// step 2
//    octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

    ctx.drawImage(oc, 0, 0, 250, 250,
      0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL();
  }
   
  if (file) {
    reader.readAsDataURL(file); 
  }

   
  reader.addEventListener("load", function () {
            img.src = reader.result;

     }, false);

}