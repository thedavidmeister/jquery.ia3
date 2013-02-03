(function( d )
{
  var h = d.getElementsByTagName( 'head' )[ 0 ];

  function loadCss()
  {
    if ( !d.__image_a_trois_css_loaded )
    {
      d.__image_a_trois_css_loaded = true;
      var c = d.createElement( 'link' );
      c.rel = 'stylesheet';
      c.type = 'text/css';
      c.href = 'http://image-a-trois.godeldesign.com.au/lib/ia3.css';
      h.appendChild( c );
    }
  }
  function loadJquery()
  {
    if ( typeof jQuery == 'undefined' )
    {
      var s = d.createElement( 'script' );
      s.type = 'text/javascript';
      s.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js';
      s.onload = function() {
        loadJqueryUi();
      };
      s.onreadystatechange = function () {
        if ( this.readyState == 'complete' )
        {
          loadJqueryUi();
        }
      };
      h.appendChild( s );
    }
    else
    {
      loadJqueryUi();
    }
  }

  function loadJqueryUi()
  {
    if ( typeof jQuery.ui == 'undefined' ||
      typeof jQuery.ui.resizable == 'undefined' ||
      typeof jQuery.ui.draggable == 'undefined' )
    {
      var s = d.createElement( 'script' );
      s.type = 'text/javascript';
      s.src = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js';
      s.onload = function() {
        loadImageATrois();
      };
      s.onreadystatechange = function () {
        if ( this.readyState == 'complete' )
        {
          loadImageATrois();
        }
      };
      h.appendChild( s );
    }
    else
    {
      loadImageATrois();
    }
  }

  function loadImageATrois()
  {
    if ( typeof jQuery.image_a_trois == 'undefined' )
    {
      var s = d.createElement( 'script' );
      s.type = 'text/javascript';
      s.src = 'http://godeldesign.com.au/lib/ia3.js';
      s.onload = function() {
        triggerImageATrois();
      };
      s.onreadystatechange = function () {
        if ( this.readyState == 'complete' )
        {
          triggerImageATrois();
        }
      };
      h.appendChild( s );
    }
    else
    {
      triggerImageATrois();
    }
  }
  function triggerImageATrois()
  {
    jQuery.image_a_trois();
  }

  loadCss();
  loadJquery();

})( document );
