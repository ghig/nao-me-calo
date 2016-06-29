var autocomplete;
var map;

function initAutocomplete () {
  var mapField = $('#map')[0]
  map = new google.maps.Map(mapField, {
    center: {lat: -30.0277, lng: -51.2287},
    zoom: 12
  });

  initMap();
  createPin();
  cleanPlaceIdValueFromInput();
  initLists();

  var searchField = $('#searchField')[0];
  var types = {types: ['establishment']};

  searchBox = new google.maps.places.Autocomplete(searchField, types);

  var evaluateField = $('#evaluateField')[0];

  autocomplete = new google.maps.places.Autocomplete(
    (evaluateField),
    {types: ['establishment']});

    autocomplete.addListener('place_changed', fillName);
    searchBox.addListener('place_changed', fillSearch);
  }

  function fillName(){
    var place = autocomplete.getPlace();
    $('#place_id').val(place.place_id);
  }

  function fillSearch(){
    var place = searchBox.getPlace();
    $('#place_id_2').val(place.place_id);
  }

  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
        searchBox.setBounds(circle.getBounds());
      });
    }
  }

  function cleanPlaceIdValueFromInput(){
    $('#place_id').val('');
    $('#place_id_2').val('');
  }

  function initMap() {

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function createPin(){
    for(var i = 0; i<locations.length; i++){
      var locate = locations[i];
      var iconColor = locate[3];
      var myLatLng = {lat: locate[1], lng: locate[2]};
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: locate[0],
        icon: iconColor,
        optimized: false
      });
      var contentString = '<div id="content">'+
      '<a href="/perfil/' + locate[4].toString() + '">' + '<label class="concept_welcome padding-bottom ' + locate[6].toString() + '">' + locate[5].toString() + '</label>' +
      '<h3 id="firstHeading" class="text-center">'+ locate[0].toString() +'</h3>'+
      '<div id="bodyContent"></a>'+
      '</div>'+
      '</div>';
      marker.info = new google.maps.InfoWindow({
        content: contentString
      });
      google.maps.event.addListener(marker, 'click', function(){
        var marker_map = this.getMap();
        this.info.open(marker_map, this);
      });
    }
  }

  function initLists(){
    $('#bottom_5').hide();
  }

  $(document).ready(function(){

    initLists();

    // Comentado porque repete a funcao de cima
    // function initLists(){
    //   $('#bottom_5').hide();
    // }

    function switchListBest(){
      if($('#bottom_5').is(":visible")){
        $('#top_5').show();
        $('#bottom_5').hide();
      }
    }

    function switchListWorst(){
      if($("#top_5").is(":visible")){
        $('#top_5').hide();
        $('#bottom_5').show();
      }
    }

    $('#best_places_button').click(function(){
      switchListBest();
    })
    $('#worst_places_button').click(function(){
      switchListWorst();
    })
    $('#place_id').attr('readonly', true)
    $('#place_id_2').attr('readonly', true)

    $('#formEvaluate').submit(function(e){
      if($('#place_id').val() == ''){
        e.preventDefault();
      }
    });

    $('#formSearch').submit(function(e){
      if($('#place_id_2').val() == ''){
        e.preventDefault();
      }
    });
  });
