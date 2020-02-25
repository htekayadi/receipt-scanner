import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
const { array } = React.PropTypes;

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {  
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    this.setState({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
    this.props.numbers.forEach(number => {
      if(x >= number.vertices[0].x && x <= number.vertices[1].x && y >= number.vertices[0].y && y <= number.vertices[2].y) {
        window.confirm(number.number);
        return;
      }
    })
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    
    const img = this.refs.image;
   
    if(img != null) {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 400, 600);
        ctx.beginPath();
        ctx.fillStyle = "#f0ff048c";

        this.props.numbers.forEach(number => {
          ctx.fillRect(
            number.vertices[0].x,
            number.vertices[0].y,
            number.vertices[1].x - number.vertices[0].x,
            number.vertices[2].y - number.vertices[0].y);
        })
        ctx.stroke();
      };
    }
  }

  render() {
    const imageUrl = this.props.imageUrls[0] ? this.props.imageUrls[0].url : ''
    return (
      <div>
        <Grid container divided streched centered>
          <div className="previewComponent">
              <div className="imgPreview">
                  <canvas ref="canvas" width={400} height={600} onClick={this.handleClick}/>
                  <img
                    style={{display: 'none'}}
                    ref="image"
                    src={imageUrl}
                    onClick={this.handleClick}
                  />
              </div>
          </div>
        </Grid>
      </div>
    );
  }
}

Preview.PropTypes = {
  imageUrls: array
};
