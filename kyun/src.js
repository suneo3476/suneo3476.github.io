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
    		const url = data.profile_image_url
    		const imgPreloader = new Image()
    		imgPreloader.onload=function(){
	   			$('#icon').attr({'src':url})
    		}
    		imgPreloader.src=url
    		console.log(url)
    	})
	})
})