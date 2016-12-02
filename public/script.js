$(document).ready(function() {

var loader = function() {
  var loc = window.location.pathname.split('/')[1];
  if (loc === 'contacts') {
    $('button.update').each(function(x) {
      $(this).click(function(){
        var name = $('a.title_link')[x].textContent;
        var title = $('span.1')[x].textContent;
        var email = $('span.email')[x].textContent;
        var phone = $('span.2')[x].textContent;
        var source = $('span.3')[x].textContent;
        var notes = $('span.4')[x].textContent;
        var id = $('a.title_link')[x].href.split('interactions/')[1];
        var cid = $(this).data('company');
        var link = "/contacts/"+id+"/"+cid+"?_method=PUT"

        if(email === 'Puffin.AI Guess') {
          email = '';
        }

        $('input[name="contact"]').val(name);
        $('input[name="title"]').val(title);
        $('input[name="email"]').val(email);
        $('input[name="phone"]').val(phone);
        $('input[name="found_through"]').val(source);
        $('textarea[name="note"]').val(notes);

        $('input.inputs').each(function(y) {
          if($(this).val() != '') {
            $(this).attr('placeholder','');
          }
        })

        if($('textarea[name="note"]').val() != '') {
          $('textarea[name="note"]').attr('placeholder','');
        }

        $('div#create h1').text('Edit Contact')
        $('button.btn[name="action"]').text('Update')

        $('div#create form').attr('action',link)
      })
    })
    $('span.email').each(function(x){
      if($(this).text() === '') {
        $(this).html('<a class="guesser">Puffin.AI Guess</a>');
        $('.guesser').last().click(function(){
          var address = $('h1.headline').data('url');
          if(address === '') {
            var address = prompt('What is their email domain? (e.g. "@gmail.com")')
          } else {
            if (address.includes('www.')) {
              address = '@'+address.split('www.')[1];
            } else if (address.includes('://')) {
              address = '@'+address.split('://')[1]
            } else {
              address = '@'+address;
            }
            address = address.split('/')[0]
          }
          var name = $('.title_link')[x].text.split(' ');
          if (name.length != 2) {
            name = prompt('What is their first and last name? (e.g. Mark Zuckerberg)');
            name = name.split(' ');
          }
          var fname = name[0].toLowerCase();
          var lname = name[1].toLowerCase();
          var guesses = [];
          guesses.push(fname+lname);
          guesses.push(fname+'.'+lname);
          guesses.push(fname+'_'+lname);
          guesses.push(fname[0]+lname);
          guesses.push(fname[0]+'.'+lname);
          guesses.push(fname[0]+'_'+lname);
          guesses.push(fname+lname[0]);
          guesses.push(fname+'.'+lname[0]);
          guesses.push(fname+'_'+lname[0]);
          guesses.push(lname[0]+fname);
          guesses.push(lname[0]+'.'+fname);
          guesses.push(lname[0]+'_'+fname);
          guesses.push(lname+fname);
          guesses.push(lname+'.'+fname);
          guesses.push(lname+'_'+fname);
          guesses.push(lname+fname[0]);
          guesses.push(lname+'.'+fname[0]);
          guesses.push(lname+'_'+fname[0])
          guesses.push(fname);
          guesses.push(lname);
          guesses.push(fname[0]);
          guesses.push(lname[0]);
          guesses.push(fname[0]+lname[0]);
          guesses.push(fname[0]+'.'+lname[0]);
          guesses.push(fname[0]+'_'+lname[0]);
          guesses.push(lname[0]+fname[0]);
          guesses.push(lname[0]+'.'+fname[0]);
          guesses.push(lname[0]+'_'+fname[0]);

          guesses.forEach(function(x,y){
            guesses[y] = x+address;
          })
          window.location.href= 'mailto:?bcc='+guesses;
        })
      }
    })
  } else if(loc === 'companies') {
    $('button.update').each(function(x) {
      $(this).click(function(){
        var name = $('a.title_link')[x].textContent;
        var ind = $('span.1')[x].textContent;
        var add = $('a.1')[x].href;
        var desc = $('span.2')[x].textContent;
        var id = $('a.title_link')[x].href.split('contacts/')[1];

        if(add === 'http:/') {
          add = '';
        }

        $('input[name="company"]').val(name).attr('placeholder','')
        $('input[name="industry"]').val(ind).attr('placeholder','')
        $('input[name="url"]').val(add).attr('placeholder','')
        $('textarea[name="desc"]').val(desc).attr('placeholder','')

        $('div#create h1').text('Edit Company')
        $('button.btn[name="action"]').text('Update')

        $('div#create form').attr('action','/companies/'+id+'?_method=PUT')
      })
    })
  } else if(loc.includes('interactions')) {
    $('button.update').each(function(x) {
      $(this).click(function(){
        var name = $('a.title_link')[x].textContent;
        var ind = $('span.1')[x].textContent;
        var add = $('a.1')[x].href;
        var desc = $('span.2')[x].textContent;
        var id = $('a.title_link')[x].href.split('contacts/')[1];

        if(add === 'http:/') {
          add = '';
        }

        $('input[name="company"]').val(name).attr('placeholder','')
        $('input[name="industry"]').val(ind).attr('placeholder','')
        $('input[name="url"]').val(add).attr('placeholder','')
        $('textarea[name="desc"]').val(desc).attr('placeholder','')

        $('div#create h1').text('Edit Company')
        $('button.btn[name="action"]').text('Update')

        $('div#create form').attr('action','/companies/'+id+'?_method=PUT')
      })
    })
  }
}

loader();
});
