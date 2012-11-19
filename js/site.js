$(function()
{
	var $bh = ( $.browser.webkit ) ? $( 'body' ) : $( 'html' );
	$('#menu a').bind(
		'click.site',
		function( e )
		{
			e.preventDefault();
			$bh.animate({
				'scrollTop': $( $(this).attr( 'href' ) ).offset().top
			}, 1000);
		}
	);


	var l = $(window).width() / 2;
	if ( l < 495 )
	{
		l = 495;
	}
	$.image_a_trois( 'website.jpg', {
		width: 445,
		height: 190,
		top: 635,
		left: l + 50,
		aligned: 'center',
		pinned: true
	});

	var link = "javascript:(function(){var s=document.createElement('script');s.src='http://image-a-trois.frebsite.nl/bm/ia3-loader.js';s.type='text/javascript';var h=document.getElementsByTagName('head');h[0].appendChild(s);})();";
	$('#bookmarklet').attr( 'href', link );
});