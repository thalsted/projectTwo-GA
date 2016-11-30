$(document).ready(function() {

var emailGuesser = function() {
  var loc = window.location.pathname.split('/')[1];
  if (loc === 'contacts') {
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
  }
}

emailGuesser();
});
