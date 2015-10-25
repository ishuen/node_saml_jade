// $('.showPo').click(function (e) {
//     e.preventDefault(); // otherwise, it won't wait for the ajax response
// 	var href = $('a:eq(0)').attr('href');
// 	$('#main').load(href);
// });

$('.profile').click(function (e) {
    e.preventDefault(); // otherwise, it won't wait for the ajax response
	var href = $('a:eq(1)').attr('href');
	$('#main').load(href);
});

