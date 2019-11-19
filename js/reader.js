// codes de test :
// 754300900790080031200009
// 520955880310090048800009
// 520955860310092048800009


// todo :
// save to localstorage
// lean visual error / repeat effects


$(function() {

  // barcode procesing
  function get_reader_entry(in_code){

    if (in_code) {
    code = in_code
    }
    else {
      var code = $form.find( "input[name='s']" ).val();
    }

    
    console.log('scanned code :: '+code);
    if (code.length == 24) {
      console.log('code valide :: '+code);
      
      t = {}
      t.code = code
      t.num = code.substring(1,9) ;
      t.cle = code.substring(10,11) ;
      t.montant = parseInt(code.substring(12,16)) ;
      t.ttype = code.substring(18,19) ;
      t.validite = code.substring(23,24) ;

      console.log('code valide :: '+t);

      //CompteAvant = listeTr.size
      //listeTr = listeTr.add(t.num, t)
      //CompteApres = listeTr.size

      if ( typeof listeTr.get(code) !== "undefined") {
        console.log('ticket deja scanne')
        play_repeat()
      }
      else {
        listeTr.set(code, t)
        localStorage.setItem("liste_tickets", JSON.stringify( Array.from(listeTr.entries())));
        // var jsonText = JSON.parse(localStorage.getItem('liste_tickets'));
        // listeTr = new Map(JSON.parse(jsonText));


        update_results();
      }

      console.log('montant : '+t.montant) ;
      console.log('nombre : '+listeTr.size) ;


    }
    else {
    console.log('code non valide :: '+code);
    play_error()

    }

   
  } 





function update_results() {
  somme = 0
    for (const [key, value] of listeTr.entries()) {
       somme += value.montant;
    }

  $("#montant_total").text(somme/100 + ' €');
  $("#nombre").text(listeTr.size);
  $("#message").text('');
  updateConfigByMutating() ;
  //create_chart()
}


function create_chart() {
  groupes = Array.from(listeTr.values())
  comptes = groupes.reduce(function(rv, x) {
    (rv[x['montant']]  = rv[x['montant']]  + 1 || 1 );
    return rv;
  }, {});

  var data = {labels: [], values: [] }

  for (i in comptes) {
    data.labels.push(i/100);
    data.values.push(comptes[i])
  }


  var ctx = document.getElementById('trChart');
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: data.labels,
          datasets: [{
              label: 'tickets par montants',
              data: data.values
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
  return myChart

  }

function updateConfigByMutating() {
  groupes = Array.from(listeTr.values())
  comptes = groupes.reduce(function(rv, x) {
    (rv[x['montant']]  = rv[x['montant']]  + 1 || 1 );
    return rv;
  }, {});

  var data = {labels: [], values: [] }

  for (i in comptes) {
    data.labels.push(i/100);
    data.values.push(comptes[i])
  }
  
    myChart = chart_tr
    myChart.data.labels  = data.labels;
    myChart.data.datasets =[ { label: 'tickets par montants', data: data.values }]

    myChart.update();
}



// gestion des sons
// type : sine / square / sawtooth / triangle
// pour choisir les frequences and co :
// http://jsbin.com/tupoyi/4/edit?html,js,output
function play_repeat() {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();


    $("#message").text('Ticket deja scanne');

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = 0.5;
    oscillator.frequency.value = 210;
    oscillator.type = 'sawtooth';
    oscillator.start();
    duration = 100 // en ms
    setTimeout(function(){oscillator.stop();}, duration); 

};

function play_error() {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    $("#message").text('Code non valide');


    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    //gainNode.gain.value = 1;
    oscillator.frequency.value = 400;
    oscillator.type = 'sine';
    oscillator.start();
    duration = 120 // en ms
    setTimeout(function(){oscillator.stop();}, duration);  
};


  // user interface
  function shortcut(code){
    console.log("shortcut :: "+code);
    switch (code.toLowerCase()){
      case "o": break;                break;
      default:console.log("shortcut :: no match");
    }
  }
  function scanmode(){
    // s field ready
    $("#code_input").focus();
    $("#code_input").val('');
  }
  
// test


function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}



function generator(nbre){
for (var i = 0; i < nbre; i++) {
    t = {}
      code = Math.round(Math.random()*10e+11).toLocaleString('fullwide', {useGrouping:false})
      code = code + (Math.round(randomIntFromInterval(6,12)*100)).toFixed(0).padStart(4, '0');
      code = code + '33200009' ;

      get_reader_entry(code)
    }
}





  // init
  function init(){
    scanmode();
    chart_tr = create_chart();
  }

  // vars

  $form = $( "#searchForm" ),
  listeTr = new Map()
  somme = 0
  compte = 0
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  
  // events
  $form.submit(function( event ) {
    event.preventDefault();
    get_reader_entry();
    scanmode();
  });
  $("#test_graph").click(function(event) {
    console.log("test de 5") ;
    generator(5) ;
    
  } )

  $("#load_save").click(function(event) {
    console.log("recup des data") ;
      var jsonText = JSON.parse(localStorage.getItem('liste_tickets'));
      console.log(jsonText);
      listeTr = new Map(jsonText);    
      update_results();
  } 

  )
  

  $( "html" ).keypress(function(event) {$("#code_input").focus();});

  init();
})





