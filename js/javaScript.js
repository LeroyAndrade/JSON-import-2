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
    let titel = "";
    if ( boek.voorTitel ){
     titel += boek.voorTitel + " ";
    }
    titel += boek.titel;


    //boek houd al de waarde vast van resultaat__Leesbaar[i]
    //alles binnen de variabele 'html', komt terecht in document.getElementById('boeken');
    html += `<article>
              ${titel} 
             </article>`   
   });
   uitvoer.innerHTML = html;

  }
}
