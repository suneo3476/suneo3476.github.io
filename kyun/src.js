// $(document).on('click', '#textarea-submit', function(){
// 	//const id = 
// })
$('#textarea-submit').click(function(e) {
    return e.preventDefault();                      //<=★コレよ。
});
$("[name='my-checkbox']").bootstrapSwitch();