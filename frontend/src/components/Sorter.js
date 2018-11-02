
class Sorter {
        //json is for array of records 
        //string for field to sort by (ex: book.title) -> use switch case?
        //boolean for ascending/descending -> change sorting type

  function stringSort(jsonArray, field, order) {  
    if(order == true){

      jsonArray.sort((record1, record2) => {
      record1[field].localeCompare(record2[field], 'fr', {ignorePunctuation: true})
       });

    }else{
      jsonArray.sort((record1, record2) => {
        record1[field].localeCompare(record2[field], 'fr', {ignorePunctuation: true})
         }); //sorts the array first
     jsonArray.reverse((record1, record2) => {
     record1[field].localeCompare(record2[field], 'fr', {ignorePunctuation: true})
        }); //reverses the sorted array
    }
    
   return console.log(jsonArray);
  }
 
  function infSort(jsonArray, field, order){

 }

}
 

 exports.Sorter=Sorter;   

  