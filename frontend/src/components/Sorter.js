
class Sorter {
    //json is for array of records 
    //string for field to sort by (ex: book.title) -> use switch case?
    //boolean for ascending/descending -> change sorting type

    stringSort(jsonArray, field, descending) {
        jsonArray.sort((record1, record2) => {
            record1.field.localeCompare(record2.field, 'fr', {ignorePunctuation: true})
        })
        if (descending) {
            jsonArray.reverse();
        }
        return console.log(jsonArray);
    }

    intSort(jsonArray, field, descending){
        jsonArray.sort((record1, record2) => {
            return record1.field -record2.field;//ascending order
        });
        if (descending) {
            jsonArray.reverse();
        }
        return console.log(jsonArray);
    }
}


exports.Sorter=Sorter;   

