class Sorter {
    //json is for array of records 
    //string for field to sort by (ex: book.title) -> use switch case?
    //boolean for ascending/descending -> change sorting type

    stringSort(jsonArray, field, descending) {
        jsonArray.sort((record1, record2) => {
            return record1[field].toString().localeCompare(record2[field].toString());
        })
        if (descending) {
            jsonArray.reverse();
        }
        console.log(jsonArray);
    }

    intSort(jsonArray, field, descending){
        jsonArray.sort((record1, record2) => {
            return record1[field] - record2[field];//ascending order
        });
        if (descending) {
            jsonArray.reverse();
        }
        console.log(jsonArray);
    }
}

const instance = new Sorter();
exports.getInstance = () => {
    return instance;
}