class Movie {
    constructor(props){
        this.title = props.title;
        this.director = props.director;
        this.producers=props.producers;
        this.actors=props.actors;
        this.language= props.language;
        this.subtitles = props.subtitles;
        this.dubbed =props.dubbed;
        this.releaseDate= props.releaseDate;
        this.runTime= props.runTime;
    }
}
exports.Movie = Movie; 