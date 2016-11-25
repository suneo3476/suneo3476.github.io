$(document).ready(()=>{
	$('#textarea-submit').click((e) => {
	    return e.preventDefault();                      //<=★コレよ。
	});
	// $("[name='textarea-switch']").bootstrapSwitch();
	OAuth.initialize('p9ec33SRheUKfTzs-y-6crX_ros');
	OAuth.popup('twitter')
  		 .done(function(res) {
    	res.get('/1.1/account/verify_credentials.json').done(function(data) {
    		// console.log(data)
	   		$('#icon').attr('src',data.profile_image_url)
    	})
	})
})