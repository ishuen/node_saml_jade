$('.button').click(function (e) {
    e.preventDefault(); // otherwise, it won't wait for the ajax response
	var href = $('.button').attr('href');
	$('#main').load(href);
});

$('.profile').click(function (e) {
    e.preventDefault(); // otherwise, it won't wait for the ajax response
	var href = $('a:eq(1)').attr('href');
	$('#main').load(href);
});

$('.newPost').click(function (e) {
    e.preventDefault(); // otherwise, it won't wait for the ajax response
	var href = $('a:eq(2)').attr('href');
	$('#main').load(href);
});