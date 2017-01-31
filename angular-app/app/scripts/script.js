
$(document).ready(function () {

	$(document).on('click',function(ev){
		console.log((ev.target).closest('#moreOptionsTrigger')!=null)
		var bx=document.getElementById('moreOptions');

		if((ev.target).closest('#moreOptionsTrigger')!=null)
			    bx.style.display='block'

		else if((ev.target).closest('#moreOptions')==null)
			    bx.style.display='none'
				

	})
});

$(document).ready(function () {
	Materialize.updateTextFields();
});

