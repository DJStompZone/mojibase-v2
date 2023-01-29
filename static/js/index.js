
// isoworker = new Worker('isoworker.js')

         //function() {
   // var $this = $(this);
//     filterWorker.postMessage($grid, ${})
//     if ( !$this.hasClass('gigante') ) {
//       $grid.find('.gigante').removeClass('gigante');
//     }
//     $this.toggleClass('gigante');
//   // update sort data, sort, and layout
//   $grid.isotope('layout');
// })

function getChar(qry) {
    var outpt = "";
    if (typeof(qry) === typeof('')) {
        if (qry.includes('.png')) {
            let output = parseInt(qry)
            if (output.toString() == 'NaN') {
                console.error(`Error in getChar: ${qry} cannot be converted to an integer`)
                return null
            } else {
                outpt = String.fromCharCode(output)
            }
        } else {
            //todo: import stickerdict
        }
    } else if (typeof(qry) == typeof(1)) {
        if (47000 < qry < 70000) {
            outpt = String.fromCharCode(qry)
        } else {
            console.error(`Error in getChar: ${qry} is outside valid range`);
            return null;
        }
    } else {
        console.error(`Error in getChar: ${qry} is an invalid type: ${typeof(qry)}`)
        return null
    }
    console.log(`getChar returning ${outpt} for ${qry}`)
    return outpt
}

function getName(code) {
    //todo: import stickerdict
    let emojiname = stickerdict[`${code}`].name
    console.log(`${code}: ${emojiname}`)
    return emojiname
}


      // $grid.isotope("layout");
      