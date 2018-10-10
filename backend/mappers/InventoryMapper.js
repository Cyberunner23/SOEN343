class InventoryMapper {
    constructor() {
        this.books = [];
    }

    async getBooks() {
        return new Promise((resolve, reject) => {
            resolve(this.books);
        });
    }

    async addBook(book) {
        this.books.push(book);
    }

}

const instance = new InventoryMapper();

exports.getInstance = () => {
    return instance;
}