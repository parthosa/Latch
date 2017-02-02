
$(document).ready(function () {

	$(document).on('click',function(ev){
		console.log((ev.target).closest('#moreOptionsTrigger')!=null)
		var bx=document.getElementById('moreOptions');

		if(bx!=null){
			if((ev.target).closest('#moreOptionsTrigger')!=null)
				    bx.style.display='block'

			else if((ev.target).closest('#moreOptions')==null)
				    bx.style.display='none'
				
		}
	})
});

$(document).ready(function () {
	Materialize.updateTextFields();
});



function previewFile() {
      var preview = document.querySelector('img#img-preview');
      var file    = document.querySelector('input#profile-pic-upload').files[0];
      var reader  = new FileReader();
        console.log(2)

      reader.addEventListener("load", function () {
    	preview.style.display='block';
        preview.src = reader.result;
        
      }, false);

      if (file) {
        console.log(3)

        reader.readAsDataURL(file);
      }
}

