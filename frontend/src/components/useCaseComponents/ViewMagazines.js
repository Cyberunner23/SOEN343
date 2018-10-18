import React, { Component } from 'react';

export default class ViewMagazines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            publisher: '',
            date: '',
            language: '',
            isbn10: '',
            isbn13: '',
            app: props.app,
            magazines: [],
            magazineAdded: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/api/catalogue/getMagazines')
            .then(res => {
                res.json().then(
                    magazines => this.setState({ magazines: magazines })
                )
            });
    }

    render() {
        var magazineAddedMessage;
        if (this.state.magazineAdded) {
            magazineAddedMessage = (
                <div>{this.state.magazineAddedMessage}</div>
            )
        }
        var content;
        content = (

            <div>
                <ul>
                    {this.state.magazines.map(magazine =>
                        <li key={magazine.title}>{magazine.title}
                        <button onClick={() => { this.removeMagazines(magazine.isbn10) }}> Delete</button>
                        </li>
                    )}
                </ul>

                <div className='UseCaseComponent'>
                    <form onSubmit={this.handleSubmit} method="POST">
                        <label>
                            Title:
        <input type="text" name="title" onChange={this.handleChange} />
                        </label>
                        <label>
                            Publisher:
        <input type="text" name="publisher" onChange={this.handleChange} />
                        </label>
                        <label>
                            Date:
        <input type="text" name="date" onChange={this.handleChange} />
                        </label>
                        <label>
                            Language:
        <input type="text" name="language" onChange={this.handleChange} />
                        </label>
                        <label>
                            ISBN-10:
        <input type="text" name="isbn10" onChange={this.handleChange} />
                        </label>
                        <label>
                            ISBN-13:
        <input type="text" name="isbn13" onChange={this.handleChange} />
                        </label>
                        <button onClick={this.handleSubmit}>Submit</button>
                    </form>
                    {magazineAddedMessage}
                </div>
            </div>
        );

        return (
            <div className='ViewBooksComponent UseCaseComponent'>
                <h2>Magazines</h2>
                {content}
            </div>
        )
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, magazineAdded: false});
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.addMagazine(this.state)
            .then((magazine) => {
                if (magazine !== null) {
                    console.log('Magazine added successfully');
                    this.setState({ magazineAdded: true, magazineAddedMessage: 'New magazine ' + magazine.title + ' added' })
                } else {
                    console.log('Magazine already added');
                    this.setState({ magazineAdded: true, magazineAddedMessage: 'magazine already added' })
                }
            }).then(() => {
                this.componentDidMount();
            })
    }

    async removeMagazines(isbn) {
        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/removeMagazines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isbn10: isbn })
            }).then((res => {
                if (res.status === 200) {
                    console.log("deleted magazine");
                } else {
                    console.log(res)
                }
            })).then(() => { this.componentDidMount(); });
        })
    }

    async addMagazine(props) {
        let title = props.title
        let publisher = props.publisher
        let date= props.date
        let language= props.language
        let isbn10=props.isbn10
        let isbn13=props.isbn13

        return new Promise((resolve, reject) => {
            fetch('/api/catalogue/addMagazine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({title, publisher, date, language, isbn10, isbn13})
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((magazine) => {
                        resolve(magazine);
                    })
                }
                else {
                    resolve(null);
                }
            });
        })
    }
}
