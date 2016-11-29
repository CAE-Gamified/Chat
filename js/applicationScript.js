/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var client, chatContent;

var init = function() {
  
  var iwcCallback = function(intent) {
    // define your reactions on incoming iwc events here
    console.log(intent);
  };
  
  Y({
    db: {
      name: 'memory'
    },
    connector: {
      name: 'websockets-client',
      room: 'cae-room'
    },
    sourceDir: 'http://y-js.org/bower_components',
    share: {
      chat: 'Array'
    }
  }).then(function (y) {
    window.yChat = y
    
    // Insert the initial content
    chatContent = y.share.chat;
    chatContent.toArray().forEach(appendMessage)
    cleanupChat()
    //chatContent.delete(0,chatContent.length)
    // whenever content changes, make sure to reflect the changes in the DOM
    chatContent.observe(function (event) {
      console.log(event)
      if(event.length == 1){
        if (event[0].type === 'insert') {
          //for (var i = 0; i < event[0].length; i++) {
            console.log(event[0].value)
            appendMessage(event[0].value, event[0].index )
          //}
        } else if (event[0].type === 'delete') {
          //for (var i = 0; i < event[0].length; i++) {
            chat.children[event[0].index].remove()
          //}
        }// concurrent insertions may result in a history > 7, so cleanup here
      cleanupChat()
      }
      else{
        $("#chat").html('')
      }

      
    })
  })

  $('#sendButton').on('click', function() {
    sendFunction();
  })

  $('#clearButton').on('click', function() {
    clearFunction();
  })
}


// sendFunction
var sendFunction = function(){
   // the form is submitted
      var message = {
        username: $('#name').val(),
        message: $('#message').val()
      }
      if (message.username.length > 0 && message.message.length > 0) {
        if (chatContent.length > 6) {
          // If we are goint to insert the 8th element, make sure to delete first.
          chatContent.delete(0)
        }
        // Here we insert a message in the shared chat type.
        // This will call the observe function (see line 40)
        // and reflect the change in the DOM
        chatContent.push([message])
        //console.log(chatContent.toArray())
        $('#message').val('');
      }
}

// clearFunction
var clearFunction = function(){
  chatContent.delete(0,chatContent.toArray().length)
}

$(document).ready(function() {
  init();
});

// This functions inserts a message at the specified position in the DOM
function appendMessage(message, position) { 
  var p = document.createElement('p')
  var uname = document.createElement('span')
  uname.appendChild(document.createTextNode(" " + message.username + ": "))
  p.appendChild(uname)
  p.appendChild(document.createTextNode(message.message))
  document.querySelector('#chat').insertBefore(p, chat.children[position] || null)
}
// This function makes sure that only 7 messages exist in the chat history.
// The rest is deleted
function cleanupChat () {
  var len;
  while ((len = chatContent.length) > 7) {
    chatContent.delete(0)        
  }
}
