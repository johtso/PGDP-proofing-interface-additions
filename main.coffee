selection = null
pieRadius = 0

###
Functions
###

togglePie = ->
  if $("#piecanvas").length == 0
    leftPos = currentMousePos.x
    topPos = if currentMousePos.y > pieRadius then currentMousePos.y else pieRadius

    $piemenu.pieMenu 
      left: leftPos
      top: topPos
     ,
      closeRadius: 0
      closePadding: 40
      closeSymbolSize: 0
      selectedColor: 'rgba(50, 205, 50, 0.3)',
      backgroundColor: 'rgba(30, 144, 255, 0.3)',
      globalAlpha: 1.0
      elementStyle:
        position: "absolute"
      onSelection: onPieSelect
  else
    pieRadius = $("#piecanvas").height()/2
    $("#piecanvas").remove()

onPieSelect = (item) ->
  pieRadius = $("#piecanvas").height()/2
  action = item.attr('id')
  {start, end, text} = selection = $textarea.getSelection()

  if formattingActions[action]
    do formattingActions[action]
  else
    console.log "I don't know how to do that :("

reselect = ->
  $textarea.setSelection(selection.start, selection.end)

wrapSelection = (before, after) ->
  # If selection has a space at the end, don't wrap it
  if selection.text[selection.text.length-1] is ' '
    $textarea.setSelection(selection.start, selection.end-1)
  $textarea.surroundSelectedText(before, after)

formattingActions =
  italics: ->
    wrapSelection('<i>', '</i>')
  small_caps: ->
    wrapSelection('<sc>', '</sc>')
  bold: ->
    wrapSelection('<b>', '</b>')

  no_wrap: ->
    $textarea.surroundSelectedText('/*\n', '\n*/')
  block_quote: ->
    $textarea.surroundSelectedText('/#\n', '\n#/')

  capitalise: ->
    new_text = selection.text.toUpperCase()
    $textarea.replaceSelectedText(new_text)
    reselect()
  titlecase: ->
    # Titlecase function doesn't seem to work if text is all-caps
    new_text = (selection.text.toLowerCase()).toTitleCase()
    $textarea.replaceSelectedText(new_text)
    reselect()
  lowercase: ->
    new_text = selection.text.toLowerCase()
    $textarea.replaceSelectedText(new_text)
    reselect()

  footnote: ->
    text = selection.text
    first_word = (text.split " ", 1)[0]

    if isNaN(first_word) and first_word.length > 1
      $textarea.surroundSelectedText('[Footnote: ', ']')
    else
      the_rest = text[first_word.length..text.length]
      $textarea.replaceSelectedText("[Footnote #{first_word}:#{the_rest}]")
  
  thought_break: ->
    $textarea.replaceSelectedText('\n<tb>\n')


imgURL = (url) ->
  path = '/images/'+url+'.png'
  chrome.extension.getURL path

###
Events
###

currentMousePos = x: -1, y: -1
$(document).mousemove (event) ->
  currentMousePos = 
    x: event.pageX
    y: event.pageY

$(document).bind 'keydown', 'ctrl+shift+m', togglePie
$('#text_data').bind 'keydown', 'ctrl+shift+m', togglePie

$(document).click ->
  if $("#piecanvas").length > 0
    $("#piecanvas").remove()

###
Main
###

$('body').append """
<ul id="piemenu" style="visibility:hidden; position: absolute; right:-1">
  <li id="small_caps"><img src="#{imgURL 'small_caps'}"></li>
  <li id="italics"><img src="#{imgURL 'italics'}"></li>
  <li id="bold"><img src="#{imgURL 'bold'}"></li>


  <li id="capitalise"><img src="#{imgURL 'capitalize'}"></li>
  <li id="titlecase"><img src="#{imgURL 'titlecase'}"></li>
  <li id="lowercase"><img src="#{imgURL 'lowercase'}"></li>

  <li id="no_wrap"><img src="#{imgURL 'nowrap'}"></li>
  <li id="block_quote"><img src="#{imgURL 'block_quote'}"></li>

  <li id="footnote"><img src="#{imgURL 'footnote'}"></li>
  <li id="thought_break"><img src="#{imgURL 'thought_break'}"></li>
</ul>
"""

$piemenu = $('#piemenu')
$textarea = $('#text_data')

# console.log window.location.pathname

# if $("frameset").length > 0
#   console.log "I'm in the main frame of standard layout, do nothing"
# else
#   console.log "I'm in the "