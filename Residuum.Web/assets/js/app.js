(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 57)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 57
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Scroll reveal calls
  window.sr = ScrollReveal();
  sr.reveal('.sr-icons', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 200);
  sr.reveal('.sr-button', {
    duration: 1000,
    delay: 200
  });
  sr.reveal('.sr-contact', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 300);

  // Magnific popup calls
  $('.popup-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1]
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    }
  });

})(jQuery); // End of use strict

function GetRaidProgress() {
  $("#progressLoading").show();

  var request = new XMLHttpRequest();

  request.open('GET', 'https://residuumservices.azurewebsites.net/api/raidprogress');

  request.onload = function() {
    var progress = JSON.parse(this.response);
    
    var div = $("#progress");

    if(request.status >= 200 && request.status < 400) {
      $.each(progress, function(id) {
        div.append("<a target='_blank' href='"+GetRaidRaiderIoLink(progress[id].Key, progress[id].Summary)+"'><div style='background-image:url("+GetRaidingPictureLink(progress[id].Key)+")' class='raid'>" + GetRaidDisplayName(progress[id].Key) + "<br/>" + GetRaidSummary(progress[id].Summary) +"</div>")
      });
    } else {
      console.log('error');
    }

    $("#progressLoading").hide();
  };

  request.send();
}

function GetRaidSummary(summary) {
  var difficulty = GetDisplayDifficultyName(summary);

  return summary.slice(0, -1) + difficulty;
}

function GetDisplayDifficultyName(summary) {
  var difficultyLetter = summary[summary.length-1];
  
  switch(difficultyLetter) {
    case "N":
      return "Normal";
    case "H":
      return "Heroic";
    case "M":
      return "Mythic";
  }

  return "Normal";
}

function GetRaidRaiderIoLink(raidName, summary) {
  return "https://raider.io/"+raidName+"/faction-realm-rankings/eu/connected-thunderhorn/"+GetDisplayDifficultyName(summary)+"/horde";
}

function GetGuildRoster() {
  $("#raidingLoading").show();

  var request = new XMLHttpRequest();

  request.open('GET', 'https://residuumservices.azurewebsites.net/api/guildroster');

  request.onload = function() {
    var roster = JSON.parse(this.response);
    
    var div = $("#roster");

    if(request.status >= 200 && request.status < 400) {
      $.each(roster, function(id) {
        var raiderIoLink = roster[id].BestMythic.ProfileUri;
        var shortName = roster[id].BestMythic.short_name;
        var dungeon = roster[id].BestMythic.dungeon;
        var mythicLevel = roster[id].BestMythic.mythic_level;
        var className = roster[id].Class;
        var name = roster[id].Name;

        div.append("<a href="+raiderIoLink+" target='_blank'><div class='player'><div class='playerOverlay'>" +         
          GetClassImage(className) + " " +  name + " " + GetMythicDetails(shortName, dungeon, mythicLevel) + 
          "</div><div class='mythicBackground' style='background-image: url("+ GetClasssImageLink(className) +")' ></div></a>");          
      });
    } else {
      console.log('error');
    }

    $("#raidingLoading").hide();       
  };

  request.send();
}

function GetClasssImageLink(className) {
  return "assets/img/ClassIcons/"+className.toLowerCase()+".png";
}

function GetClassImage(className) {
  return "<img class='playerClass' src='"+GetClasssImageLink(className.toLowerCase())+"'>";
}

function GetMythicDetails(shortName, name, mythicLevel) {
  if(shortName == "N") return "";
  
  var picture = GetMythicPicture(shortName.toLowerCase());

  return " | " + picture + " " + name + "+" + mythicLevel;
}

function GetMythicPicture(shortName) {
  return "<img class='mythicImage' onerror=\"this.src='assets/img/MythicIcons/default-raid.jpg'\" src='assets/img/MythicIcons/"+shortName+".jpg'>";
}

function GetRaidingPictureLink(raidName) {
  return "assets/img/MythicIcons/"+raidName+".jpg";
}

function GetRaidDisplayName(raidName) {
  if(raidName === "battle-of-dazaralor") {
    return "Battle of Dazar'alor";
  }

  if(raidName === "crucible-of-storms") {
    return "Crucible Of Storms";
  }

  if(raidName === "uldir") {
    return "Uldir";
  }

  return raidName;
}

GetGuildRoster();
GetRaidProgress();