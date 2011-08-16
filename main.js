(function() {
  var $piemenu, $textarea, currentMousePos, formattingActions, imgURL, onPieSelect, pieRadius, reselect, selection, togglePie, wrapSelection;
  selection = null;
  pieRadius = 0;
  /*
  Functions
  */
  togglePie = function() {
    var leftPos, topPos;
    if ($("#piecanvas").length === 0) {
      leftPos = currentMousePos.x;
      topPos = currentMousePos.y > pieRadius ? currentMousePos.y : pieRadius;
      return $piemenu.pieMenu({
        left: leftPos,
        top: topPos
      }, {
        closeRadius: 0,
        closePadding: 40,
        closeSymbolSize: 0,
        selectedColor: 'rgba(50, 205, 50, 0.3)',
        backgroundColor: 'rgba(30, 144, 255, 0.3)',
        globalAlpha: 1.0,
        elementStyle: {
          position: "absolute"
        },
        onSelection: onPieSelect
      });
    } else {
      pieRadius = $("#piecanvas").height() / 2;
      return $("#piecanvas").remove();
    }
  };
  onPieSelect = function(item) {
    var action, end, start, text, _ref;
    pieRadius = $("#piecanvas").height() / 2;
    action = item.attr('id');
    _ref = selection = $textarea.getSelection(), start = _ref.start, end = _ref.end, text = _ref.text;
    if (formattingActions[action]) {
      return formattingActions[action]();
    } else {
      return console.log("I don't know how to do that :(");
    }
  };
  reselect = function() {
    return $textarea.setSelection(selection.start, selection.end);
  };
  wrapSelection = function(before, after) {
    if (selection.text[selection.text.length - 1] === ' ') {
      $textarea.setSelection(selection.start, selection.end - 1);
    }
    return $textarea.surroundSelectedText(before, after);
  };
  formattingActions = {
    italics: function() {
      return wrapSelection('<i>', '</i>');
    },
    small_caps: function() {
      return wrapSelection('<sc>', '</sc>');
    },
    bold: function() {
      return wrapSelection('<b>', '</b>');
    },
    no_wrap: function() {
      return $textarea.surroundSelectedText('/*\n', '\n*/');
    },
    block_quote: function() {
      return $textarea.surroundSelectedText('/#\n', '\n#/');
    },
    capitalise: function() {
      var new_text;
      new_text = selection.text.toUpperCase();
      $textarea.replaceSelectedText(new_text);
      return reselect();
    },
    titlecase: function() {
      var new_text;
      new_text = (selection.text.toLowerCase()).toTitleCase();
      $textarea.replaceSelectedText(new_text);
      return reselect();
    },
    lowercase: function() {
      var new_text;
      new_text = selection.text.toLowerCase();
      $textarea.replaceSelectedText(new_text);
      return reselect();
    },
    footnote: function() {
      var first_word, text, the_rest;
      text = selection.text;
      first_word = (text.split(" ", 1))[0];
      if (isNaN(first_word) && first_word.length > 1) {
        return $textarea.surroundSelectedText('[Footnote: ', ']');
      } else {
        the_rest = text.slice(first_word.length, (text.length + 1) || 9e9);
        return $textarea.replaceSelectedText("[Footnote " + first_word + ":" + the_rest + "]");
      }
    },
    thought_break: function() {
      return $textarea.replaceSelectedText('\n<tb>\n');
    }
  };
  imgURL = function(url) {
    var path;
    path = '/images/' + url + '.png';
    return chrome.extension.getURL(path);
  };
  /*
  Events
  */
  currentMousePos = {
    x: -1,
    y: -1
  };
  $(document).mousemove(function(event) {
    return currentMousePos = {
      x: event.pageX,
      y: event.pageY
    };
  });
  $(document).bind('keydown', 'ctrl+shift+m', togglePie);
  $('#text_data').bind('keydown', 'ctrl+shift+m', togglePie);
  $(document).click(function() {
    if ($("#piecanvas").length > 0) {
      return $("#piecanvas").remove();
    }
  });
  /*
  Main
  */
  $('body').append("<ul id=\"piemenu\" style=\"visibility:hidden; position: absolute; right:-1\">\n  <li id=\"small_caps\"><img src=\"" + (imgURL('small_caps')) + "\"></li>\n  <li id=\"italics\"><img src=\"" + (imgURL('italics')) + "\"></li>\n  <li id=\"bold\"><img src=\"" + (imgURL('bold')) + "\"></li>\n\n\n  <li id=\"capitalise\"><img src=\"" + (imgURL('capitalize')) + "\"></li>\n  <li id=\"titlecase\"><img src=\"" + (imgURL('titlecase')) + "\"></li>\n  <li id=\"lowercase\"><img src=\"" + (imgURL('lowercase')) + "\"></li>\n\n  <li id=\"no_wrap\"><img src=\"" + (imgURL('nowrap')) + "\"></li>\n  <li id=\"block_quote\"><img src=\"" + (imgURL('block_quote')) + "\"></li>\n\n  <li id=\"footnote\"><img src=\"" + (imgURL('footnote')) + "\"></li>\n  <li id=\"thought_break\"><img src=\"" + (imgURL('thought_break')) + "\"></li>\n</ul>");
  $piemenu = $('#piemenu');
  $textarea = $('#text_data');
}).call(this);
