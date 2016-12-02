$(document).ready(function() {

var loader = function() {
  var loc = window.location.pathname.split('/')[1];
  if (loc.includes('contacts')) {
    var p1 = $('input[name="contact"]').attr('placeholder');
    var p2 = $('input[name="title"]').attr('placeholder');
    var p3 = $('input[name="email"]').attr('placeholder');
    var p4 = $('input[name="phone"]').attr('placeholder');
    var p5 = $('input[name="found_through"]').attr('placeholder');
    var p6 = $('textarea[name="note"]').attr('placeholder');
    var places = [p1,p2,p3,p4,p5];

    $('button.update').each(function(x) {
      $(this).click(function(){
        var name = $('a.title_link')[x].textContent;
        var title = $('span.1')[x].textContent;
        var email = $('span.email')[x].textContent;
        var phone = $('span.2')[x].textContent;
        var source = $('span.3')[x].textContent;
        var notes = $('span.4')[x].textContent;
        var id = $(this).data('contact');
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
          } else {
            $(this).attr('placeholder',places[y])
          }
        })

        if($('textarea[name="note"]').val() != '') {
          $('textarea[name="note"]').attr('placeholder','');
        } else {
          $('textarea[name="note"]').attr('placeholder',p6);
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
  } else if(loc.includes('companies')) {
    var p1 = $('input[name="company"]').attr('placeholder');
    var p2 = $('input[name="industry"]').attr('placeholder');
    var p3 = $('input[name="url"]').attr('placeholder');
    var p4 = $('textarea[name="desc"]').attr('placeholder');
    var places = [p1,p2,p3];

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

        $('input[name="company"]').val(name);
        $('input[name="industry"]').val(ind);
        $('input[name="url"]').val(add);
        $('textarea[name="desc"]').val(desc);

        $('input.inputs').each(function(y) {
          if($(this).val() != '') {
            $(this).attr('placeholder','');
          } else {
            $(this).attr('placeholder',places[y])
          }
        })

        if($('textarea[name="desc"]').val() != '') {
          $('textarea[name="desc"]').attr('placeholder','');
        } else {
          $('textarea[name="desc"]').attr('placeholder',p4);
        }

        $('div#create h1').text('Edit Company')
        $('button.btn[name="action"]').text('Update')

        $('div#create form').attr('action','/companies/'+id+'?_method=PUT')
      })
    })
  } else if(loc.includes('interactions')) {
    var p1 = $('input[name="int_date"]').attr('placeholder');
    var p2 = $('input[name="type"]').attr('placeholder');
    var p3 = $('input[name="next"]').attr('placeholder');
    var p4 = $('input[name="next_date"]').attr('placeholder');
    var p5 = $('textarea[name="note"]').attr('placeholder');
    var places = [p1,p2,p3,p4];

    $('button.update').each(function(x) {
      $(this).click(function(){
        var intDate = $(this).data('date');
        var type = $('span.1')[x].textContent;
        var nxtStep = $('span.2')[x].textContent;
        var nxtDate = $(this).data('date1');
        var notes = $('span.3')[x].textContent;
        var id = $(this).data('int');
        var cid = $(this).data('contact');
        var link = "/interactions/"+id+"/"+cid+"?_method=PUT"

        $('input[name="int_date"]').val(intDate);
        $('input[name="type"]').val(type);
        $('input[name="next"]').val(nxtStep);
        $('input[name="next_date"]').val(nxtDate);
        $('textarea[name="note"]').val(notes);

        $('input.inputs').each(function(y) {
          if($(this).val() != '') {
            $(this).attr('placeholder','');
          } else {
            $(this).attr('placeholder',places[y])
          }
        })

        if($('textarea[name="note"]').val() != '') {
          $('textarea[name="note"]').attr('placeholder','');
        } else {
          $('textarea[name="note"]').attr('placeholder',p5);
        }

        $('div#create h1').text('Edit Interaction')
        $('button.btn[name="action"]').text('Update')

        $('div#create form').attr('action',link)
      })
    })
  }
}

loader();
});
