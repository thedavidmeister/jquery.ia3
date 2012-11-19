(function( $ )
{

	var $w, $d, $h, $b, $bh;
	var winWidth = null,
		docWidth = null,
		centered = null,
		numOfIa3 = 0,
		iazIndex = 99000;


	$.image_a_trois = function( iImg, iOpts )
	{
		if ( numOfIa3 == 3 )
		{
			alert( 'Woops, there\'s a maximum of 3...' );
			return false;
		}
		if ( numOfIa3 == 0 )
		{
			$w = $(window),
			$d = $(document),
			$h = $('html'),
			$b = $('body'),
			$bh = ( $.browser.webkit ) ? $( 'body' ) : $( 'html' );
		}

		var imgWidth = null;
		var opts = $.extend( true, {}, $.image_a_trois.defaults, iOpts );

		if ( typeof opts.aligned == 'string' )
		{
			centered = ( opts.aligned == 'center' );
		}
		if ( centered === null )
		{
			centered = confirm( 'Is the page centered (OK) or aligned left (Cancel)?' );
		}


		//	add markup
		var $wrp = $( '<div class="ia3-wrapper" />' ).appendTo( $b );
		var $img = $( '<img class="ia3-image" />' ).appendTo( $wrp );
		var $pin = $( '<a href="#" class="ia3-pin" />' ).appendTo( $wrp );
		var $opc = $( '<div class="ia3-opacity" />' ).appendTo( $wrp );
		var $prc = $( '<div class="ia3-percentage" />' ).appendTo( $opc );


		//	public methods
		$wrp.loadImage = function( i )
		{
			$wrp.bringToFront();
			if ( typeof i != 'string' )
			{
				i = prompt( 'Specify an image-url' );
			}
			if ( i && i.length )
			{
				$img.attr( 'src', i );
			}
		};
		$wrp.updatePosition = function()
		{
			$img.css({
				'top': $wrp.getPosition( 'Top' ),
				'left': $wrp.getPosition( 'Left' )
			});
		};
		$wrp.pinPosition = function( pin )
		{
			if ( typeof pin != 'boolean' )
			{
				pin = !$wrp.hasClass( 'pinned' );
			}

			var t = $wrp.offset().top,
				l = $wrp.offset().left,
				f = 'add';

			if ( !pin )
			{
				t -= $bh.scrollTop();
				l -= $bh.scrollLeft();
				f = 'remove';
			}
			$wrp[ f + 'Class' ]( 'pinned' );
			$wrp.css({
				'top'	: t,
				'left'	: l
			});
		}
		$wrp.getPosition = function( Pos )
		{
			var x = $wrp.offset()[ Pos.toLowerCase() ];

			if ( Pos == 'Left' && centered )
			{
				if ( !imgWidth )
				{
					imgWidth = $img.width();
				}
				x -= ( docWidth - imgWidth ) / 2;
			}
			return Math.round( -x );
		};
		$wrp.bringToFront = function()
		{
			$wrp.css( 'zIndex', iazIndex );
			iazIndex++;
		};


		//	handle loading images
		$img.hide();
		$img.bind(
			'load.ia3',
			function( e )
			{
				$img.show();
				$wrp.updatePosition();
			}
		);
		$img.bind(
			'error.ia3',
			function( e )
			{
				$img.hide();
				alert( 'Could not load the image. Double click the placeholder to try again.' );
			}
		);

		//	make resizable + draggable
		var updatingOnDrag = false;
		$wrp.resizable({
			'stop': function( e, ui )
			{
				$opc.trigger( 'mousemove.ia3', true );
			}
		});
		$wrp.draggable({
			'start': function( e, ui )
			{
				updatingOnDrag = setInterval(
					function()
					{
						$wrp.updatePosition();
					}, 5
				);
			},
			'stop': function( e, ui )
			{
				clearInterval( updatingOnDrag );
				$wrp.updatePosition();
			}
		});
		$wrp.removeClass( 'ui-draggable' );

		//	click to put on top
		$wrp.bind(
			'mousedown.ia3',
			function( e )
			{
				$wrp.bringToFront();
			}
		);

		//	double click to load a new image
		$wrp.bind(
			'dblclick.ia3',
			function( e )
			{
				$wrp.loadImage();
			}
		);

		//	click pin to toggle pinned
		$pin.bind(
			'click.ia3',
			function( e )
			{
				e.preventDefault();
				$wrp.pinPosition();
			}
		);

		// move mouse to set opacity
		var draggingOpacity = false;
		var currentOpacity = opts.opacity;
		$opc.bind(
			'mousedown.ia3',
			function( e )
			{
				e.stopPropagation();
				draggingOpacity = true;
			}
		);
		$opc.bind(
			'mouseup.ia3 mouseleave.ia3',
			function( e )
			{
				draggingOpacity = false;
			}
		);
		$opc.bind(
			'mousemove.ia3',
			function( e, o )
			{
				var w = $wrp.width();
				if ( o === true )
				{
					o = currentOpacity;
				}
				else if ( draggingOpacity )
				{
					var p = e.pageX - ( $wrp.offset().left + 10 );
					o = p / ( w - 30 );
				}
				if ( typeof o == 'number' )
				{
					if ( o < 0 )
					{
						o = 0;
					}
					if ( o > 1 )
					{
						o = 1;
					}
					$prc.width( Math.ceil( ( w - 20 ) * o ) );

					currentOpacity = o;

					o *= 0.7;
					o += 0.3;
					o = Math.round( o * 10 ) / 10;

					$wrp.css( 'opacity', o );
				}
			}
		);
		$prc.bind(
			'mousedown.ia3',
			function( e )
			{
				e.preventDefault();
			}
		);

		// hover to show / hide options
		$wrp.bind(
			'mouseenter.ia3',
			function( e )
			{
				$opc.show();
				$pin.show();
			}
		);
		$wrp.bind(
			'mouseleave.ia3',
			function( e )
			{
				$opc.hide();
				$pin.hide();
			}
		);

		//	update position on scroll and resize
		var windowChange = false;
		var leftPosPerc = null;
		var leftPosPix = null;
		$w.bind(
			'resize.ia3',
			function( e )
			{
				$wrp.hide();
				winWidth = $w.width();
				docWidth = $d.width();
				$wrp.show();
			}
		).trigger( 'resize.ia3' );
		$w.bind(
			'resize.ia3',
			function( e )
			{
				if ( !windowChange )
				{
					if ( $wrp.hasClass( 'pinned' ) && centered )
					{
						leftPosPix = parseInt( $wrp.css( 'left' ), 10 );
						leftPosPerc = Math.round( leftPosPix / docWidth * 100 );
					}
					windowChange = setTimeout(
						function()
						{
							if ( $wrp.hasClass( 'pinned' ) && centered )
							{
								if ( winWidth >= docWidth )
								{
									$wrp.css( 'left', leftPosPerc + '%' );
								}
								else
								{
									$wrp.css( 'left', leftPosPix );
								}
							}
							$wrp.updatePosition();
							windowChange = false;
						}, 5
					);
				}
			}
		);
		$w.bind(
			'scroll.ia3',
			function( e )
			{
				$wrp.updatePosition();
			}
		);

		//	init defaults
		$wrp.pinPosition( opts.pinned );
		$wrp.css({
			'width': opts.width,
			'height': opts.height,
			'left': opts.left,
			'top': opts.top
		});

		$opc.trigger( 'mousemove.ia3', opts.opacity );
		$wrp.trigger( 'mouseleave.ia3' );

		iazIndex++;
		numOfIa3++;

		//	start! load an image
		$wrp.loadImage( iImg );

		//	for using the public methods
		return $wrp;
	};

	$.image_a_trois.defaults = {
		'width': 200,
		'height': 200,
		'left': 50,
		'top': 50,
		'pinned': false,
		'aligned': false,
		'opacity': 1
	};

})( jQuery );