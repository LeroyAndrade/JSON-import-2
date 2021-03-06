const uitvoer = document.getElementById('boeken');
const xhr = new XMLHttpRequest;

//checkbox taal filter
const taalKeuze = document.querySelectorAll('.besturing__cb-taal');

//selecteer keuze eigenschappen boeken
const selectSort = document.querySelector('.besturing__select');


const aantalInWinkelwagen = document.querySelector('.ww__aantallen');
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

/*
xhr.onreadystatechange = () =>{
 if (xhr.readyState){
  console.log("Status: " + xhr.status + ' status: ' +xhr.readyState);
 }
 else jsonRequestNok();
}
*/

xhr.onerror = jsonRequestNok; 
  function jsonRequestNok(){
   window.alert("Error: " + xhr.status + ' ' + '<br>' + xhr.readyState);
  }


//onload is dat de request goedgekeurd is
xhr.onload = jsonRequestOk;

//alle code die uitgevoerd moet worden wanneer XHRequest positief is.
  function jsonRequestOk(){
    let resultaat = JSON.parse(this.responseText);
  //  console.log(typeof(resultaat)); -> object
    var resultaat__Leesbaar = resultaat;
     console.log(resultaat__Leesbaar);

   //object(boeken).data  zal alle data opslaan in het object, mag net zo goed boeken.datal zijn

    boeken.data = resultaat;
    //voer uit(object.functie)
    boeken.filteren(resultaat);
    boeken.uitvoeren();
   
    }


  

  xhr.send();

//end XHR


    /*object winkelwagen -> ww
      properties: 
      methods:    e.preventDefault, boekToevoegen, dataOphalen, uitvoeren
    */
    const ww =  {
     bestelling: [],

     boekToevoegen(obj) { 
//
      let gevondenDuplicaat = this.bestelling.filter( b => b.ean == obj.ean);
       if  (gevondenDuplicaat.length == 0)
           {
            obj.besteldAantal ++;
            ww.bestelling.push(obj);
           } 
       else 
           {
            gevondenDuplicaat[0].besteldAantal ++;
           aantalInWinkelwagen.innerHTML = this.bestelling.length;
           localStorage.winkelWagenBestelling = JSON.stringify(this.bestelling);
           this.uitvoeren();
           }

     },
 
     dataOphalen() {
     
       
       if (localStorage.winkelWagenBestelling){
        this.bestelling = JSON.parse(localStorage.winkelWagenBestelling);
        this.uitvoeren();

       }
     }, 
      uitvoeren(){
       let html = '<table>';
       let totaal = 0;
       let totaalBesteld = 0;
       //wanneer een voortitel beschikbaar is, dan moet deze vóór de titel worden geplaatst
         this.bestelling.forEach( boek => {
         let compleetTitel = "";
         if ( boek.voorTitel ){
          compleetTitel += boek.voorTitel + " ";
         }
         compleetTitel += boek.titel;
             html += '<tr>';
             html += `<td><img src="${boek.cover}" alt="${compleetTitel}" class="bestelFormulier__cover"></td>`;
             html += `<td>${compleetTitel}</td>`;
             html += `<td> aantal&#40;len&#41;: ${boek.besteldAantal}</td>`;
             html += `<td>${boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>`;
             html += '</tr>';
             html += '';
             totaal += boek.prijs * boek.besteldAantal;
             totaalBesteld += boek.besteldAantal;
           });
           
           html += `<tr><td colspan="2"></td>
            <td>${totaal.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'})}</td>
            </tr>'`;            ;
           html += '<tr><td>Totaal</td> </tr>';
 
        html += '</table>';
        document.getElementById("uitoer").innerHTML = html;
        aantalInWinkelwagen.innerHTML = totaalBesteld;
      }
    }
    //data Lokaal opslag 

    ww.dataOphalen();
    //JSON string -> JS object
     
    /*object boeken
      properties: taalfilter, data
      methods:    filteren, sorteren, uitvoeren
    */
const boeken = {
// filter op taal van het boek 


 taalFilter: ['Nederlands', 'Engels', 'Duits'],
 eigenschapSorteren: 'titel', 
 //taalFilter: ['Duits', 'Nederlands'],

 //sorteer eigenschap
 oplopend: 1,


   filteren(gegevens){
  //  this.data = gegevens.filter( ( boekFilter ) => {return boekFilter.taal == this.taalFilter} ) ;
   this.data = gegevens.filter( ( boekFilter ) => {
    let boolean = false;
     this.taalFilter.forEach( ( taal ) =>{
       if( boekFilter.taal == taal){ boolean = true;}
     } )
    //else
    return boolean;
   } ) 
  },

  //sorteer functie
  sorteren() {
  // 
//        if (this.eigenschapSorteren == 'titel'  ) { this.data.sort( (a,b) => ( a.titel.toUpperCase()   > b.titel.toUpperCase()  ? 1 : -1));}
        if (this.eigenschapSorteren == 'titel'  ) { this.data.sort( (a,b) => ( a.titel.toUpperCase()   > b.titel.toUpperCase()  ? this.oplopend : -1*this.oplopend));}
   else if (this.eigenschapSorteren == 'paginas') { this.data.sort( (a,b) => ( a.paginas               > b.paginas              ? this.oplopend : -1*this.oplopend));}
   else if (this.eigenschapSorteren == 'uitgave') { this.data.sort( (a,b) => ( a.uitgave               > b.uitgave              ? this.oplopend : -1*this.oplopend));}
   else if (this.eigenschapSorteren == 'prijs'  ) { this.data.sort( (a,b) => ( a.prijs                 > b.prijs                ? this.oplopend : -1*this.oplopend));}
   else if (this.eigenschapSorteren == 'auteur' ) { this.data.sort( (a,b) => ( a.auteur[0].achternaam  > b.auteur[0].achternaam ? this.oplopend : -1*this.oplopend));}
  },

  uitvoeren() {
   this.sorteren();
   let html = "";
   //this is het object boeken
   this.data.forEach( boek => {
  //elk boek een eigenschap   aantalBesteld, zodat het niet extra zal tonen, dit is de opzet
   boek.besteldAantal =0;
  //
    
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
      //https://www.codegrepper.com/code-examples/javascript/how+to+filter+object+in+javascript
       html += `<section    class="boek">                                                                                                                                     `;
         html += `<img      class="boek__cover" src="${compleetAfbeelding}" alt="                                   ${ compleetTitel                    }                   ">`;
             html += `<article  class="boek__cover boek__kopje boek__boekInformatieTotaalOrder1">      <b>          ${ compleetTitel                    }                 </b>`;   
               html += `<p        class="boek__auteurs">                                               <b>          ${ auteurs                          }      </b>       </p>`;   
               html += `<span     class="boek__uitgave">                                                            ${ this.datumOmzetten(boek.uitgave) }              </span>`;
               html += `<span     class="boek__ean">                                                   EAN:         ${ boek.ean                         }              </span>`;
               html += `<span     class="boek__cover boek__boekInformatieTotaalOrder1">                Bindwijze:   ${ boek.bindwijze                   }              </span>`; 
               html += `<span     class="boek__paginas">                                                            ${ boek.paginas                     }      blz.    </span>`;
               html += `<span     class="boek__taal">                                                               ${ boek.taal                        }              </span>`;
             html +=                                                                                                                                               `</article>`;         
            //Alles na deze regel komt aan de rechter zijde van boek.titel
         html += `<span     class="boek__prijs">                                                                    ${ bedrag                           }    
                  <input type="button" class="buttonBetaal boek__bestel-knop" value="Voeg toe" data-role="${boek.ean}">                                                </span>`;
               
       html += `</section>`;
   });
   uitvoer.innerHTML = html;
   //de gemaakte knoppen, krijgt een eventListener
   document.querySelectorAll('.boek__bestel-knop').forEach( knop => {
     knop.addEventListener('click', e => { 
      e.preventDefault();
      
      //hier lees je de value uit van de HTML data-role
      let boekID = e.target.getAttribute('data-role');
      let gekliktBoek = this.data.filter(b => b.ean == boekID);

 //dit is code voor duplicaat item
 //     gekliktBoek[0].besteldAantal ++;
      ww.boekToevoegen(gekliktBoek[0]);
    })
   });

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
//checkbox van HTML - taal keuze
//console.log taalKeuze weergeeft een NodeList, hier kun je forEach, door heen loopen
const pasFilterAan = () => {
 let gecheckteTaalKeuze = [];

 taalKeuze.forEach( cb => {
  if(cb.checked) gecheckteTaalKeuze.push(cb.value);
 });
boeken.taalFilter = gecheckteTaalKeuze;

 boeken.filteren(JSON.parse(xhr.responseText));
 boeken.uitvoeren();
 // taalFilter: ['Nederlands', 'Engels', 'Duits']
}

const pasSortEigAan = () => {
 boeken.eigenschapSorteren = selectSort.value;
 console.log('sorten op' + boeken.eigenschapSorteren)
 boeken.uitvoeren();
}

taalKeuze.forEach ( cb => cb.addEventListener('change', pasFilterAan) );
selectSort.addEventListener('change', pasSortEigAan);
document.querySelectorAll('.besturing__radioButton').forEach( rb => rb.addEventListener('change', () =>{
 boeken.oplopend = rb.value;
 boeken.uitvoeren();
}));