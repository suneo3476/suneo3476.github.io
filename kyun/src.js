$('#textarea-submit').click(function(e) {
    return e.preventDefault();                      //<=★コレよ。
});
$("[name='textarea-switch']").bootstrapSwitch();