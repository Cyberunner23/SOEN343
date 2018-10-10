import React, { Component } from 'react';

export default class ActiveUsers extends Component {

    constructor(props) {
        super();
        this.state = {
            app: props.app,
            books: [],
        }
    }

    componentDidMount() {
        fetch('/api/getBooks')
        .then(res => {
                res.json().then(
                    books => this.setState({books: books})
                )
        });
    }

    render() {
        var content;
        content = (
            <ul>
                {this.state.books.map(book =>
                    <li key={book.title}>{book.title}</li>
                    )}
            </ul>
        );

        return (
            <div className = 'ViewBooksComponent UseCaseComponent'>
                <h2>Books</h2>
                {content}
            </div>
        )
    }
}
