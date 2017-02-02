$(document).ready(function () {

  $(document).on('click', function (ev) {
    console.log((ev.target).closest('#moreOptionsTrigger') != null)
    var bx = document.getElementById('moreOptions');

    if (bx != null) {
      if ((ev.target).closest('#moreOptionsTrigger') != null)
        bx.style.display = 'block'

      else if ((ev.target).closest('#moreOptions') == null)
        bx.style.display = 'none'

    }
  })
});

$(document).ready(function () {
  Materialize.updateTextFields();
});


var dataURL;

function previewFile() { 
  var preview = document.querySelector('img#img-preview'); 
  var file   = document.querySelector('input#profile-pic-upload').files[0]; 
  var reader  = new FileReader();
  //        console.log(2)

  var canvas = document.getElementById("uploaded-image");
  var ctx = canvas.getContext("2d");

  img = new Image();
  img.onload = function () {

    canvas.height = canvas.width * (img.height / img.width);

    /// step 1
    var oc = document.createElement('canvas'),
      octx = oc.getContext('2d');

    oc.width = img.width * 0.5;
    oc.height = img.height * 0.5;
    octx.drawImage(img, 0, 0, oc.width, oc.height);

    /// step 2
    octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

    ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
      0, 0, canvas.width, canvas.height);
    dataURL = canvas.toDataURL();
  }

   
  if (file) {
    //        console.log(3)
    reader.readAsDataURL(file); 
  }

   
  reader.addEventListener("load", function () {
    //    	preview.style.display='block';
            img.src = reader.result;

     }, false);

}