class Music {
    constructor(props){
        this.type= props.type;
        this.title = props.title;
        this.artist = props.artist;
        this.label= props.label;
        this.releaseDate= props.releaseDate;
        this.asin= props.asin;
        this.numAvailable= props.numAvailable;
		this.numTotal= props.numTotal;
    }
}
exports.Music = Music; 