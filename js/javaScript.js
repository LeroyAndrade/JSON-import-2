const uitvoer = document.getElementById('boeken');
const xhr = new XMLHttpRequest;


//https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open

  /*
0	UNSENT	Client has been created. open() not called yet. -> unsent
1	OPENED	open() has been called. -> opened
2	HEADERS_RECEIVED	send() has been called, and headers and status are available. ->HEADERS_RECEIVED
3	LOADING	Downloading; responseText holds partial data. ->loading
4	DONE	The operation is complete. -> done
*/

 
                                         //false = asynchronous dus wachten todat item is geladen, true = synchronous en mag de rest van de webpagina laden
 //ik kies voor true, omdat de json vanuit JS al wordt geladen nadat de HTML is ingeladen, effect heeft asynchronous het niet want JS laad vanuit de footer

 //inladen is response 200-> loading
 //done is response 4-> loading

 xhr.open('GET', './js/items.json', true);

 /*
if (xhr.readyState === 200 || xhr.readyState === 4){
 //ga naar function wanneer je één van de twee responses terug krijgt
}
*/
xhr.onreadystatechange = () =>{
 if (xhr.readyState){
  console.log("Status: " + xhr.status + ' status: ' +xhr.readyState);
 }
 else jsonRequestNok();
}

xhr.onerror = jsonRequestNok; 
  function jsonRequestNok(){
   window.alert("Error: " + xhr.status + ' ' + '<br>' + xhr.readyState);
  }



xhr.onload = jsonRequestOk;

//alle code die uitgevoerd moet worden wanneer XHRequest positief is.
  function jsonRequestOk(){
    let resultaat = JSON.parse(this.responseText);
  //  console.log(typeof(resultaat)); -> object
    let resultaat__Leesbaar = resultaat;
     console.log(resultaat__Leesbaar);

   //object(boeken).data  zal alle data opslaan in het object, mag net zo goed boeken.datal zijn

    boeken.data = resultaat;
    //voer uit(object.functie)
    boeken.uitvoeren();
    }


  

  xhr.send();

//end XHR

const boeken = {
  uitvoeren() {

   let html = "";
   //this is het object boeken
   this.data.forEach( boek => {

    //wanneer een voortitel beschikbaar is, dan moet deze vóór de titel worden geplaatst
    let compleetTitel = "";
    if ( boek.voorTitel ){
     compleetTitel += boek.voorTitel + " ";
    }
    compleetTitel += boek.titel;

    //lijst met auteurs, want in het object auteurs, zijn twee arrays benaderbaar
     let auteurs = "";

     //schrijver voornaam en achternaam
    boek.auteurs.forEach(( schrijver, index ) =>{
     let tussenvoegsel = schrijver.tussenvoegsel ? schrijver.tussenvoegsel + " " : "";
        let spatie = ", ";

        if( index >= boek.auteurs.length-2 ) { spatie = " en "; }
        if( index >= boek.auteurs.length-1 ) { spatie = ""; }
        
          auteurs+= schrijver.voornaam + " " + tussenvoegsel + schrijver.achternaam + spatie;
    });

    //Boek cover
    let compleetAfbeelding ="";
    compleetAfbeelding += boek.cover;

    let bedrag = "";
    bedrag += boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});
    //boek houd al de waarde vast van resultaat__Leesbaar[i]
    //alles binnen de variabele 'html', komt terecht in document.getElementById('boeken');
      
       html += `<section    class="boek">                                                                                                                              `;
         html += `<img      class="boek__cover" src="${compleetAfbeelding}" alt="                             ${ compleetTitel                   }                                 ">`;
         html += `<article  class="boek__cover boek__kopje boek__boekInformatieTotaalOrder1">   <b>           ${ compleetTitel                   }                    </b> </article>`;   
         html += `<p        class="boek__auteurs">                                              <b>           ${ auteurs                         }                    </b>       </p>`;   
         html += `<span     class="boek__uitgave">                                                            ${ this.datumOmzetten(boek.uitgave)}                            </span>`;
         html += `<span     class="boek__ean">                                                   EAN:         ${ boek.ean                        }                            </span>`;
         html += `<span     class="boek__cover boek__boekInformatieTotaalOrder1">                Bindwijze:   ${ boek.bindwijze                  }                            </span>`; 
         html += `<span     class="boek__paginas">                                                            ${ boek.paginas                    }                    blz.    </span>`;
         html += `<span     class="boek__taal">                                                               ${ boek.taal                       }                            </span>`;
         html += `<span     class="boek__prijs">                                                              ${ bedrag                          }                            </span>`;
       html +=                                                                                                                                           `</section>`;
   });
   uitvoer.innerHTML = html;

  },
  datumOmzetten(datumString) {
   let datum = new Date(datumString);
   let jaar = datum.getFullYear();
   let maand = this.geefMaandNaam(datum.getMonth());
   return `${maand} ${jaar}`;
  },
  geefMaandNaam(m) {
   let maand = "";

     switch (m){
      case 0 :     maand = 'januari';      break;
      case 2 :     maand = 'februari';     break;
      case 3 :     maand = 'maart';        break;
      case 4 :     maand = 'april';        break;
      case 5 :     maand = 'mei';          break;
      case 6 :     maand = 'juni';         break;
      case 7 :     maand = 'juli';         break;
      case 8 :     maand = 'augustus';     break;
      case 9 :     maand = 'september';    break;
      case 10:     maand = 'oktober';      break;
      case 11:     maand = 'november';     break;
      case 12:     maand = 'december';     break;
      default:     maand =  m;
     }
     return maand;
   }
}
