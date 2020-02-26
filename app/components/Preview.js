import React from 'react';
import { Grid, Confirm } from 'semantic-ui-react';
const { array } = React.PropTypes;

export default class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, text: '' };
  }

  handleClick = (e) => {  
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    this.setState({x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
    this.props.numbers.forEach(number => {
      if(x >= number.vertices[0].x && x <= number.vertices[1].x && y >= number.vertices[0].y && y <= number.vertices[2].y) {
        this.setState({ open: true, text: number.number })
        return;
      }
    })
  }

  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })

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
        <Confirm
          open={this.state.open}
          content={this.state.text}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          size="medium"
        />
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
