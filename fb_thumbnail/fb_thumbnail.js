window.addEventListener('DOMContentLoaded', function(){

	var fb_thumbnail_container = document.getElementsByClassName("fb_thumbnail")

	for(var i = 0; i < fb_thumbnail_container.length; i++) {

		var max_width = fb_thumbnail_container[i].clientWidth
		console.log(max_width)

		var imgs = document.querySelectorAll('.fb_thumbnail img')
		for(var i = 0; i < imgs.length; i++) {

			// direction of photo
			// w/h < 3/4 --> tate
			// w/h > 4/3 --> yoko
			// else      --> square

			var img = imgs[i]
			var len = imgs.length
			var   w = img.naturalWidth
			var   h = img.naturalHeight
			// 写真が３枚かつ１枚目が横向き
			if( len == 3 ) {
				if ( i == 0 && w/h > 4/3 ) {
					img.setAttribute("width", max_width)
				} else if ( i == 1 ) {
					img.setAttribute("width", max_width/2*0.992)
					img.setAttribute("float", "left")
				} else if ( i == 2 ) {
					img.setAttribute("width", max_width/2*0.992)
					img.setAttribute("float", "right")
				}
			}
		}
		
	}
})